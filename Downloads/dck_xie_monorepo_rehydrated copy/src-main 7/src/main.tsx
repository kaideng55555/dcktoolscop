import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/neonEffects.css';
import '../styles/hide-xie.css';
import { WalletProvider } from '../contexts/WalletContext';

// Solana wallet-adapter UI styles (WalletModalProvider)
import '@solana/wallet-adapter-react-ui/styles.css';

import { SolanaProviders } from './solana/SolanaProviders';

ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
  <React.StrictMode>
    <SolanaProviders>
      <WalletProvider>
        <App />
      </WalletProvider>
    </SolanaProviders>
  </React.StrictMode>
);