import { useEffect } from 'react';

import '../App.css';

import config from '../config.json'

import { 
  loadProvider,
  loadNetwork, 
  loadAccount, 
  loadTokens,
  loadExchange,
  subscribeToEvents, 
  loadAllOrders
} from '../store/interactions';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import Order from './Order';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';
import { useDispatch } from 'react-redux';
import Tranctions from './MyTransations';
import Alert from './Alert';



function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async ()=>{    

    const provider = loadProvider(dispatch);    
    const chainId = await loadNetwork(provider, dispatch) 
    console.log('chainId', chainId)

    window.ethereum.on('accountsChanged',async ()=>{
      const account = await loadAccount(provider, dispatch);
      console.log('account:', account)
    })
    window.ethereum.on('chainChanged',async ()=>{
      window.location.reload()
    })
   

    const addresses = [
      config[chainId].DApp.address,
      config[chainId].mETH.address
    ];
    await loadTokens(provider, addresses, dispatch );

    // load exchange Contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch);  

    // Fetch all orders: open, filled, cancelled
    loadAllOrders(provider, exchange, dispatch);
    // listen to event   
    subscribeToEvents(exchange, dispatch)
  }

  useEffect(()=>{
    loadBlockchainData()
  })

  return (
    <div>
      {/* Navbar. */}
      <Navbar />
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          {/* Markets. */}
          <Markets />
          {/* Balance. */}
          <Balance />

          {/* Order . */}
          <Order />
        </section>

        <section className='exchange__section--right grid'>
          {/* PriceChart. */}
          <PriceChart />
          {/* Transaction. */}
          <Tranctions />

          {/* Trades. */}
          <Trades />

          {/* OrderBook. */}
          <OrderBook />
        </section>
      </main>

      <Alert />

    </div>
  );
}

export default App;
