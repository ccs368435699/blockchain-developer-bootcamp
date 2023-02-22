import { createSelector } from "reselect";
import { get, groupBy } from "lodash";
import moment from "moment";
import { ethers } from "ethers";

const tokens = state=> get(state, 'tokens.contracts')
const allOrder = state => get(state, 'exchange.allOrders.data', []);

const decorateOrder = (order, tokens) =>{
    console.log(9,order)
    let token0Amount, token1Amount; //要还原成ｎｕｍｂｅｒ类型。？？？？？

    if(order.tokenGive === tokens[1].address){
        token0Amount = order.amountGive;
        token1Amount = order.amountGet;
    } else {
        token0Amount = order.amountGet;
        token1Amount = order.amountGive;
    }
    
    const precision = 100000;
    let tokenPrice = (token1Amount / token0Amount);
    tokenPrice = Math.round(tokenPrice * precision) / precision;
    

    return ({
        ...order,
        token0Amount, 
        token1Amount,
        tokenPrice
    })
}

// ------------------------------------------------------------------------
// ORDER BOOK
export const orderBookSelect = createSelector(
    allOrder, 
    tokens, 
    (orders, tokens)=>{
    // console.log('orderbookselector', orders, tokens)
    if (!tokens[0] || !tokens[1]) { return }

    orders = orders.filter((o)=> o.tokenGet === tokens[0].address || o.tokenGet ===tokens[1].address);
    orders = orders.filter((o)=> o.tokenGive === tokens[0].address || o.tokenGive ===tokens[1].address)

    orders = decorateOrderBookOrders(orders, tokens);
    orders = groupBy(orders, 'orderType');

    const buyOrders = get(orders, 'buy', []);
    console.log(11, buyOrders)

    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b)=>b.tokenPrice - a.tokenPrice)
    }

    const sellOrders = get(orders, 'sell', []);

    orders = {
        ...orders,
        sellOrders: sellOrders.sort((a, b)=>b.tokenPrice - a.tokenPrice)
    }

    console.log(111, orders)
    return orders
})

const decorateOrderBookOrders = (orders, tokens)=>{

    return (
        orders.map((order)=>{
            order = decorateOrder(order, tokens);
            order = decorateOrderBookOrder(order, tokens);
            return (order)
        })
    )
}

const GREEN = '#25CE8F';
const RED = '#F45353';

const decorateOrderBookOrder = (order, tokens)=>{
    const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell';

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
    })
}