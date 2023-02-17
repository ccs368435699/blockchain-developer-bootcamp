
import dapp from '../assets/dapp.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadBalance } from '../store/interactions';

const Balance = () => {
    const dispatch = useDispatch();
    const account = useSelector(state=>state.provider.account);
    const exchange = useSelector(state=>state.exchange.contract);
    const tokens = useSelector(state=>state.tokens.contracts);
    const symbols = useSelector(state=>state.tokens.symbols);

    useEffect(()=>{
        
        if(account && exchange && tokens[1] && tokens[0]){
            loadBalance(dispatch, exchange, tokens, account);
        }
        
    }, [exchange, tokens, account]);

    return (
        <div className="component exchange__transfers">
            <div className="component__header flex-between">
                <h2>Balance</h2>
                <div className="tabs">
                    <button className="tab tab--active">Deposit</button>
                    <button className="tab">WithDraw</button>

                </div>
            </div>
            {/* Deposit/Withdraw Component 1 (DApp) */}
            <div className="exchange__transfers--form">
                <div className="flex-between">
                    <p>
                        <small>{symbols && symbols[0]}</small>                        
                        <img src={dapp} alt = "Token logo"  />
                    </p>
                    <hr />
                </div>

                <form>
                    <label htmlFor="token0"></label>
                    <input type="text" id="token0" placeholder="0.0000" />
                    <button className="button" type="submit">
                        <span></span>
                    </button>
                </form>
            </div>
            {/* Deposit/Withdraw Component 2 (mETH) */}
            <div className="exchange__transfers--form">
                <div className="flex-between">

                </div>
                <form>
                <label htmlFor="token1"></label>
                    <input type="text" id="token1" placeholder="0.0000" />
                    <button className="button" type="submit">
                        <span></span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Balance;