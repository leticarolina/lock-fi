import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import App from './App.jsx'
import { VaultProvider } from './context/VaultContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monadscan',
      url: 'https://testnet.monadscan.com',
    },
  },
  testnet: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmn0x0ptl01dh0cl1f3mb55gm"
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          walletList: [
            'detected_ethereum_wallets',
            'metamask',
            'coinbase_wallet',
            'okx_wallet',
            'phantom',
            'backpack',
          ],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        walletChainType: 'ethereum-and-solana',
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
      }}
    >
      <ThemeProvider>
        <VaultProvider>
          <App />
        </VaultProvider>
      </ThemeProvider>
    </PrivyProvider>
  </React.StrictMode>,
)
