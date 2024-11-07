import logo from './logo.svg';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Faucet from './pages/Faucet';
import Mint from './pages/Mint';
import Redeem from './pages/Redeem';
import Ecosystem from './pages/Ecosystem';
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

export const config = getDefaultConfig({
  appName: 'Funnel Protocol',
  projectId: '07824a76188e419a3acf4226c8183b79',
  chains: [arbitrumSepolia],
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
                <Route path="/ecosystem" exact element={<Ecosystem/>}/>
              </Routes>
            </Router>
          </div>  
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
