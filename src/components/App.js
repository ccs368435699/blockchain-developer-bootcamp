import { useEffect } from 'react';
import { ethers } from 'ethers';
import '../App.css';

import config from '../config.json'

import { 
  loadProvider,
  loadNetwork, 
  loadAccount, 
  loadTokens,
  loadExchange 
} from '../store/interactions';
import Navbar from './Navbar';
import Markets from './Markets';
import { useDispatch } from 'react-redux';

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
    await loadExchange(provider, exchangeConfig.address, dispatch);  

 
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

          {/* Order . */}
        </section>

        <section className='exchange__section--right grid'>
          {/* PriceChart. */}

          {/* Transaction. */}

          {/* Trades. */}

          {/* OrderBook. */}
        </section>
      </main>
    </div>
  );
}

export default App;