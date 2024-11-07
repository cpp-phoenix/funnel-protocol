import logo from './logo.svg';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Faucet from './pages/Faucet';
import Mint from './pages/Mint';
import Redeem from './pages/Redeem';
import Bridge from './pages/Bridge';
import Navbar from './components/Navbar';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import {
  arbitrumSepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

export const funnel_testnet = {
  id: 999,
  name: 'funnel-testnet',
  network: 'funnel-testnet',
  iconUrl: 'https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://funnel-testnet.alt.technology']},
  },
  blockExplorers: {
    default: {name: 'funnelscan', url: 'funnel-testnet-explorer.alt.technology'}
  }
}

export const config = getDefaultConfig({
  appName: 'Funnel Protocol',
  projectId: '07824a76188e419a3acf4226c8183b79',
  chains: [arbitrumSepolia, funnel_testnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="bg-[#121D28] w-screen h-screen">
            <Router>
              <Navbar/>  
              <Routes>
                <Route path='/' exact element={<Home/>}/>
                <Route path='/mint' exact element={<Mint/>}/>
                <Route path='/redeem' exact element={<Redeem/>}/>
                <Route path="/faucet" exact element={<Faucet/>}/>
                <Route path="/bridge" exact element={<Bridge/>}/>
              </Routes>
            </Router>
          </div>  
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
