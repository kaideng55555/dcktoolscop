/**
 * Danger Zone Component
 * 
 * Gated component for on-chain actions with network confirmation
 */

import React, { useState } from 'react';

export type NetworkType = 'mainnet' | 'devnet' | 'testnet';

export interface DangerZoneProps {
  title?: string;
  description?: string;
  network?: NetworkType;
  defaultNetwork?: NetworkType;
  requireConfirmation?: boolean;
  confirmText?: string;
  children: React.ReactNode;
  onNetworkChange?: (network: NetworkType) => void;
  className?: string;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  title = 'Danger Zone',
  description = 'Actions in this section can result in on-chain transactions.',
  network: _network = 'devnet', // eslint-disable-line @typescript-eslint/no-unused-vars
  defaultNetwork = 'devnet',
  requireConfirmation = true,
  confirmText = 'I understand this will execute on-chain',
  children,
  onNetworkChange,
  className = '',
}) => {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(defaultNetwork);
  const [isUnlocked, setIsUnlocked] = useState(!requireConfirmation);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setCurrentNetwork(newNetwork);
    setIsUnlocked(false);
    setConfirmChecked(false);
    
    if (onNetworkChange) {
      onNetworkChange(newNetwork);
    }
  };

  const handleUnlock = () => {
    if (confirmChecked || !requireConfirmation) {
      setIsUnlocked(true);
    }
  };

  const containerStyle: React.CSSProperties = {
    border: '2px solid #dc3545',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff5f5',
    marginTop: '20px',
  };

  const headerStyle: React.CSSProperties = {
    color: '#dc3545',
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  const descriptionStyle: React.CSSProperties = {
    marginBottom: '15px',
    color: '#666',
    fontSize: '14px',
  };

  const networkSelectorStyle: React.CSSProperties = {
    marginBottom: '15px',
  };

  const networkBadgeStyle = (net: NetworkType): React.CSSProperties => ({
    display: 'inline-block',
    padding: '5px 12px',
    marginRight: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    border: currentNetwork === net ? '2px solid #007bff' : '1px solid #ccc',
    backgroundColor: currentNetwork === net ? '#e7f3ff' : '#f9f9f9',
    color: currentNetwork === net ? '#007bff' : '#333',
  });

  const confirmationStyle: React.CSSProperties = {
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #dc3545',
    borderRadius: '4px',
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const checkboxStyle: React.CSSProperties = {
    marginRight: '8px',
    cursor: 'pointer',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: confirmChecked ? '#dc3545' : '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: confirmChecked ? 'pointer' : 'not-allowed',
    fontSize: '14px',
    fontWeight: '500',
  };

  const contentStyle: React.CSSProperties = {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  };

  const lockedOverlayStyle: React.CSSProperties = {
    position: 'relative',
    filter: 'blur(3px)',
    pointerEvents: 'none',
    userSelect: 'none',
  };

  return (
    <div className={`danger-zone ${className}`} style={containerStyle}>
      <h3 style={headerStyle}>⚠️ {title}</h3>
      <p style={descriptionStyle}>{description}</p>
      
      <div style={networkSelectorStyle}>
        <strong style={{ fontSize: '14px', marginRight: '10px' }}>Network:</strong>
        <span
          style={networkBadgeStyle('devnet')}
          onClick={() => handleNetworkChange('devnet')}
          role="button"
          tabIndex={0}
        >
          Devnet {defaultNetwork === 'devnet' && '(default)'}
        </span>
        <span
          style={networkBadgeStyle('testnet')}
          onClick={() => handleNetworkChange('testnet')}
          role="button"
          tabIndex={0}
        >
          Testnet
        </span>
        <span
          style={networkBadgeStyle('mainnet')}
          onClick={() => handleNetworkChange('mainnet')}
          role="button"
          tabIndex={0}
        >
          Mainnet
        </span>
      </div>

      {requireConfirmation && !isUnlocked && (
        <div style={confirmationStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              style={checkboxStyle}
            />
            <span>{confirmText}</span>
          </label>
          <button
            onClick={handleUnlock}
            disabled={!confirmChecked}
            style={buttonStyle}
          >
            Unlock Actions
          </button>
        </div>
      )}

      <div style={contentStyle}>
        <div style={isUnlocked ? {} : lockedOverlayStyle}>
          {children}
        </div>
        {!isUnlocked && requireConfirmation && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#dc3545',
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: '2px solid #dc3545',
          }}>
            🔒 Locked
          </div>
        )}
      </div>
    </div>
  );
};
