/**
 * BullX Embed Component
 * 
 * Embeds BullX UI in an iframe with fallback support
 */

import React, { useState, useMemo } from 'react';

export interface BullXEmbedProps {
  tokenAddress?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  onError?: (error: Error) => void;
}

/**
 * Validates and sanitizes a token address
 * Returns null if the address is invalid
 */
function sanitizeTokenAddress(address: string | undefined): string | null {
  if (!address) return null;

  // Strict validation for Ethereum and Solana addresses
  // Ethereum: 0x followed by 40 hex chars; Solana: base58, 32-44 chars
  const ethPattern = /^0x[a-fA-F0-9]{40}$/;
  const solPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (!(ethPattern.test(address) || solPattern.test(address))) {
    console.warn('Invalid token address format:', address);
    return null;
  }
  return address;
}

export const BullXEmbed: React.FC<BullXEmbedProps> = ({
  tokenAddress,
  width = '100%',
  height = '600px',
  className = '',
  onError,
}) => {
  const [iframeError, setIframeError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_BULLX_EMBED_URL || 'https://bullx.io';
  
  // Sanitize token address to prevent XSS
  const sanitizedAddress = useMemo(() => sanitizeTokenAddress(tokenAddress), [tokenAddress]);
  
  const embedUrl = sanitizedAddress
    ? `${baseUrl}/terminal?chainId=1399811149&address=${sanitizedAddress}`
    : baseUrl;

  const handleIframeError = () => {
    setIframeError(true);
    setFallbackUrl(embedUrl);
    
    if (onError) {
      onError(new Error('Failed to load BullX embed'));
    }
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  };

  const iframeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
  };

  const fallbackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div className={`bullx-embed ${className}`} style={containerStyle}>
      {!iframeError ? (
        <iframe
          src={embedUrl}
          style={iframeStyle}
          title="BullX Terminal"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onError={handleIframeError}
        />
      ) : (
        <div style={fallbackStyle}>
          <h3>Unable to load BullX embed</h3>
          <p>The embedded terminal could not be loaded.</p>
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={buttonStyle}
            >
              Open BullX in new tab
            </a>
          )}
        </div>
      )}
    </div>
  );
};
