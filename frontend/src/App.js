import logo from './logo.svg';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

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

const config = getDefaultConfig({
  appName: 'Funnel Protocol',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="bg-[#1d2839] w-screen h-screen">
            <Router>
              <Navbar/>  
              <Routes>
                <Route path='/' exact element={<Home/>}/>
                <Route path='/faucet' exact element={<Faucet/>}/>
                <Route path='/liquidity' exact element={<Liquidity/>}/>
                <Route path='/trade' exact element={<Trade/>}/>
              </Routes>
            </Router>
          </div>  
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
