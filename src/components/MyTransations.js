import { useSelector } from 'react-redux';
import { myOpenOrdersSelector } from '../store/selectors';

import sort from '../assets/sort.svg';
import Banner from './Banner'
import { useState } from 'react';


const MyTranctions = ()=>{
    const [showMyOrders, setShowMyOrders] = useState(true);
    const symbols = useSelector(state=>state.tokens.symbols);
    const myOpenOrders = useSelector(myOpenOrdersSelector); 
    const myFilledOrders = useSelector(myFilledOrdersSelector);  

    const tradeRef = useRef(null);
    const orderRef = useRef(null);

    const tabHandler = (e) =>{
        if(e.target.className !== order.current.className){
            e.target.className = 'tab tab--active';
            orderRef.current.className = 'tab';
            setShowMyOrders(false);
        } else {
            e.target.className = 'tab tab--active';
            tradeRef.current.className = 'tab';
            setShowMyOrders(true);
        }
    }

    const cancelHandler = (order)=>{
        console.log('cancel order', order)
    }

    return (
        <div className="component exchange__transactions">
            <div>
                <div className="component__header flex-between">
                    <h2>My Orders</h2>
                    <div className="tabs">
                        <button className="tab tab--active">Orders</button>
                        <button className="tab">Trades</button>
                    </div>
                </div>
                {
                    !myOpenOrders || myOpenOrders.length === 0 ? (
                        <Banner text = "No Open Orders" />
                    ) : (
                        <table>
                        <thead>
                            <tr>
                                <th>{symbols && symbols[0]}</th>
                                <th>{symbols && symbols[0]/symbols && symbols[1]}<img src={sort} alt="Sort"/></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               myOpenOrders && myOpenOrders.map((order, index)=>{
    
                                    return (
                                        <tr key = {index}>
                                            <td style={{color: `${order.orderTypeClass}`}}>{order.token0Amount}</td>
                                            <td>{order.tokenPrice}</td>
                                            <td><button className='buttom--sm' onClick={()=>{cancelHandler(order)}}>Cancel</button></td>
                                        </tr>
                                    )
                                })
                            }
                            
                        </tbody>
                    </table>
                    )
                }
               
            </div>
        </div>
    )
}

export default MyTranctions;