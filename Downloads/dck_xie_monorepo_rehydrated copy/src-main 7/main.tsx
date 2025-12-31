import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App'
import { WalletProvider } from './contexts/WalletContext'
import './styles/index.css'

// Solana wallet-adapter UI styles (WalletModalProvider)
import '@solana/wallet-adapter-react-ui/styles.css';

import { SolanaProviders } from './src/solana/SolanaProviders';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaProviders>
      <WalletProvider>
        <App />
      </WalletProvider>
    </SolanaProviders>
  </React.StrictMode>,
)
