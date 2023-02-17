import { useDispatch, useSelector } from 'react-redux';
import config from '../config.json'
import { loadTokens } from '../store/interactions';


const Markets = ()=>{
    const provider = useSelector(state=>state.provider.connection);
    const chainId = useSelector(state=>state.provider.chainId);
    const dispatch = useDispatch();

    const marketHandler = async (e)=>{
        console.log("market changed ...")
        await loadTokens(provider, (e.target.value).split(','), dispatch)
    }

    return (
        <div className="component exchange__markets">
            <div className="component__header">
                <h2>Select Markets</h2>
            </div>
            {
                chainId ? (
                <select name="markets" id="markets" onChange={marketHandler}>
                    <option value={`${config[chainId].DApp.address},${config[chainId].mETH.address}`}>DApp /mETH</option>
                    <option value={`${config[chainId].DApp.address},${config[chainId].mDAI.address}`}>DApp /mDAI</option>
                
                
                </select>
    
                ) : (
                    <p>Not Deployed to Network</p>
                )
            }
           
            <hr />
        </div>
    )
}

export default Markets;