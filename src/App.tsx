import React, { useState } from 'react';
import { BullXEmbed } from './components/BullXEmbed';
import { DangerZone } from './components/DangerZone';
import { useBullXMetadata } from './hooks/useBullXMetadata';
import './App.css';

function App() {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [queryAddress, setQueryAddress] = useState<string>('');
  
  const { data: metadata, loading, error } = useBullXMetadata(
    queryAddress || null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryAddress(tokenAddress);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛠️ DCK Tools - BullX Integration</h1>
        <p>Explore token metadata and trading with BullX integration</p>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>🔍 Token Metadata Lookup</h2>
          <form onSubmit={handleSubmit} className="token-form">
            <input
              type="text"
              placeholder="Enter token address (e.g., 0x123...)"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="token-input"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {queryAddress && (
            <div className="metadata-result">
              {loading && <p className="loading">Loading metadata...</p>}
              
              {error && (
                <div className="error-box">
                  <strong>Error:</strong> {error.message}
                </div>
              )}
              
              {metadata && !loading && (
                <div className="metadata-card">
                  <h3>Token Information</h3>
                  <div className="metadata-grid">
                    <div className="metadata-item">
                      <strong>Address:</strong> {metadata.address}
                    </div>
                    {metadata.name && (
                      <div className="metadata-item">
                        <strong>Name:</strong> {metadata.name}
                      </div>
                    )}
                    {metadata.symbol && (
                      <div className="metadata-item">
                        <strong>Symbol:</strong> {metadata.symbol}
                      </div>
                    )}
                    {metadata.decimals && (
                      <div className="metadata-item">
                        <strong>Decimals:</strong> {metadata.decimals}
                      </div>
                    )}
                    {metadata.priceUSD && (
                      <div className="metadata-item">
                        <strong>Price USD:</strong> ${metadata.priceUSD.toFixed(6)}
                      </div>
                    )}
                    {metadata.marketCap && (
                      <div className="metadata-item">
                        <strong>Market Cap:</strong> ${metadata.marketCap.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!metadata && !loading && !error && (
                <div className="info-box">
                  No metadata found for this address.
                </div>
              )}
            </div>
          )}
        </section>

        <section className="section">
          <h2>📊 BullX Trading Terminal</h2>
          <BullXEmbed 
            tokenAddress={queryAddress || undefined}
            height="600px"
          />
        </section>

        <DangerZone
          title="On-Chain Actions"
          description="Execute on-chain transactions. Always test on devnet first!"
          defaultNetwork="devnet"
          requireConfirmation={true}
          confirmText="I understand this will execute real on-chain transactions"
        >
          <div className="action-buttons">
            <button className="btn-danger">Create Token</button>
            <button className="btn-danger">Mint Tokens</button>
            <button className="btn-danger">Transfer Tokens</button>
            <button className="btn-danger">Burn Tokens</button>
          </div>
        </DangerZone>
      </main>

      <footer className="app-footer">
        <p>DCK Tools v1.0.0 - Built with React, TypeScript, and Vite</p>
      </footer>
    </div>
  );
}

export default App;
