/**
 * 🚀 COPY THIS CODE INTO YOUR App.tsx
 * 
 * This is the minimal integration needed to get BullX-style cards + chat working
 */

// ============================================================================
// STEP 1: Add these imports at the TOP of your App.tsx file
// ============================================================================

// TODO: Create these components or update the paths to match your project structure
// import { TokenCardGrid } from './components/TokenCardGrid';
// import { TokenGatedChat } from './components/TokenGatedChat';
import { useState } from 'react';

// Placeholder components until you create the actual ones
const TokenCardGrid = ({ onBuy, onChat }: any) => (
  <div style={{ padding: '20px', border: '2px dashed #00d4ff', borderRadius: '8px', textAlign: 'center' }}>
    <h3>TokenCardGrid Component</h3>
    <p>Create ./components/TokenCardGrid.tsx to replace this placeholder</p>
  </div>
);

const TokenGatedChat = ({ tokenMint, tokenSymbol, requiresBalance }: any) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>TokenGatedChat Component</h3>
    <p>Create ./components/TokenGatedChat.tsx to replace this placeholder</p>
    <p>Token: {tokenSymbol} ({tokenMint})</p>
    <p>Required Balance: {requiresBalance}</p>
  </div>
);

// ============================================================================
// STEP 2: Add this state management to your App component
// ============================================================================

function App() {
  // Track which token chat is currently open
  const [activeChat, setActiveChat] = useState<{mint: string; symbol: string} | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // =========================================================================
  // STEP 3: Add these handler functions
  // =========================================================================

  const handleBuyToken = (mint: string) => {
    console.log('🛒 Buy triggered for:', mint);
    // TODO: Connect to your useQuickSnipe hook here
    // Example:
    // const { executeSnipe } = useQuickSnipe();
    // executeSnipe(mint);
  };

  const handleOpenChat = (mint: string, symbol: string) => {
    setActiveChat({ mint, symbol });
    setChatOpen(true);
  };

  // =========================================================================
  // STEP 4: Replace your existing JSX with this layout
  // =========================================================================

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: '100vh', backgroundColor: '#0a1929', color: '#fff' }}>
      {/* Main Content: Token Discovery Grid (takes remaining space) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Your existing components here */}
        {/* ... */}

        {/* NEW: BullX Token Card Grid */}
        <TokenCardGrid
          onBuy={handleBuyToken}
          onChat={handleOpenChat}
        />

        {/* Your other existing components */}
        {/* ... */}
      </div>

      {/* Chat Panel: Slides in from right on desktop, full screen on mobile */}
      {chatOpen && activeChat && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '100%',
            maxWidth: '400px',
            height: '100vh',
            backgroundColor: '#0f3460',
            borderLeft: '2px solid #00d4ff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            boxShadow: '-5px 0 20px rgba(0, 212, 255, 0.3)',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #16213e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0a1929',
            }}
          >
            <h3 style={{ margin: 0, color: '#00d4ff', fontSize: '16px' }}>
              💬 {activeChat.symbol} Token Chat
            </h3>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#16213e';
                (e.currentTarget as HTMLButtonElement).style.color = '#00d4ff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#888';
              }}
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Component - Takes remaining space */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <TokenGatedChat
              tokenMint={activeChat.mint}
              tokenSymbol={activeChat.symbol}
              requiresBalance={100}  // Minimum tokens to chat (adjust as needed)
            />
          </div>
        </div>
      )}

      {/* Mobile Overlay - Click to close chat on small screens */}
      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: window.innerWidth < 1024 ? 'block' : 'none',
            zIndex: 999,
          }}
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Add this CSS for slide animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Scrollbar styling for chat panel */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #0a1929;
        }
        div::-webkit-scrollbar-thumb {
          background: #00d4ff;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #00b4dd;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// STEP 5: Add WebSocket Support to Backend
// ============================================================================

/**
 * In your backend-python/main.py file, add:
 * 
 * from fastapi import WebSocket, WebSocketDisconnect
 * from src.services.tokenGatedChatHandler import chat_handler
 * 
 * @app.websocket("/ws/chat/{token_mint}")
 * async def websocket_endpoint(websocket: WebSocket, token_mint: str):
 *     await chat_handler(websocket, token_mint)
 */

// ============================================================================
// ALTERNATIVE: If you want cards + chat in separate views
// ============================================================================

/**
 * For a tabbed or modal layout instead of side-panel:
 * 
 * const [selectedTab, setSelectedTab] = useState<'cards' | 'chat'>('cards');
 * 
 * return (
 *   <div>
 *     <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
 *       <button onClick={() => setSelectedTab('cards')}>
 *         {selectedTab === 'cards' ? '📍' : ''} Token Cards
 *       </button>
 *       <button onClick={() => setSelectedTab('chat')}>
 *         {selectedTab === 'chat' ? '📍' : ''} Chat
 *       </button>
 *     </div>
 *     
 *     {selectedTab === 'cards' ? (
 *       <TokenCardGrid onChat={handleOpenChat} />
 *     ) : activeChat ? (
 *       <TokenGatedChat tokenMint={activeChat.mint} tokenSymbol={activeChat.symbol} />
 *     ) : (
 *       <p>Select a token card to open chat</p>
 *     )}
 *   </div>
 * );
 */

// ============================================================================
// CUSTOMIZATION OPTIONS
// ============================================================================

/**
 * 1. CHANGE MINIMUM BALANCE TO CHAT:
 * 
 *    <TokenGatedChat
 *      tokenMint={activeChat.mint}
 *      tokenSymbol={activeChat.symbol}
 *      requiresBalance={500}  // Changed from 100
 *    />
 */

/**
 * 2. CHANGE CHAT PANEL WIDTH:
 * 
 *    maxWidth: '500px'  // Was '400px'
 */

/**
 * 3. CUSTOMIZE COLORS:
 * 
 *    borderLeft: '2px solid #ff00ff'  // Change from #00d4ff
 *    backgroundColor: '#16213e'        // Dark blue variant
 */

/**
 * 4. ADD NOTIFICATIONS:
 * 
 *    const handleNewMessage = (message: any) => {
 *      if (!chatOpen) {
 *        showNotification(`New message: ${message.message}`);
 *      }
 *    };
 */

export default App;
