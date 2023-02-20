import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeBuyOrder } from "../store/interactions";


const Order = () => {
    const [isBuy, setIsBuy] = useState(true);
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const dispatch = useDispatch();
    const provider = useSelector(state=>state.provider.connection);
    const tokens = useSelector(state => state.tokens.contracts);
    const exchange = useSelector(state =>state.exchange.contract)

    const buyRef = useRef(null);
    const sellRef = useRef(null);

    const tabHandler = (e) => {
        console.log(e.target.className)
        if (e.target.className !== buyRef.current.className) {
            e.target.className = 'tab tab--active';
            buyRef.current.className = 'tab';
            setIsBuy(false);
        } else {
            e.target.className = 'tab tab--active';
            sellRef.current.className = 'tab'
            setIsBuy(true);
        };

    }

    const buyHandler = (e) => {
        console.log('buyHandler')
        e.preventDefault();
        makeBuyOrder(provider, exchange, tokens, { amount, price }, dispatch);
        setAmount(0);
        setPrice(0)

    };
    const sellHandler = (e) => {
        console.log('sellHandler')
        e.preventDefault();
        setAmount(0);
        setPrice(0);
    }

    return (
        <div className="component exchange__orders">
            <hr />
            <div className="component__header flex-between">
                <h2>New Order</h2>
                <div className="tabs">
                    <button onClick={tabHandler} ref={buyRef} className="tab tab--active">Buy</button>
                    <button onClick={tabHandler} ref={sellRef} className="tab">Sell</button>
                </div>
            </div>

            <form onSubmit={isBuy ? buyHandler : sellHandler}>
                {isBuy ? (
                    <label htmlFor = "amount">Buy Amount</label>
                ) : (
                    <label htmlFor = "amount">sell Amount</label>
                )}

                <input
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount === 0 ? '' : amount}
                    type="text"
                    id="amount"
                    placeholder="0.0000" />
                <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={amount === 0 ? '' : price}
                    type="text"
                    id="price"
                    placeholder="0.0000" />

                <button className="button button--filled" type="submit">
                    {
                        isBuy ?
                            (<span>Buy</span>) :
                            (<span>Sell</span>)
                    }
                </button>
            </form>
        </div>
    )
}

export default Order;
