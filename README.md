# DCK Tools - BullX Integration

A modern React application integrating BullX metadata and trading terminal with safety features for on-chain operations.

## Features

### 🔌 BullX Metadata Client
- Optional `BULLX_API_URL` configuration via environment variables
- Async API client with timeout support
- TypeScript types for all metadata structures
- Error handling and 404 support

### 🎣 React Hook with TTL Cache
- `useBullXMetadata` hook for easy metadata fetching
- In-memory TTL (Time-To-Live) cache for performance
- Configurable cache duration
- Loading, error, and data states
- Manual refetch capability

### 🖼️ BullX Embed Component
- Iframe-based BullX terminal embedding
- Automatic fallback when iframe fails to load
- Customizable dimensions and styling
- Token address support for direct navigation
- Sandbox security attributes

### ⚠️ Danger Zone Component
- Gated component for on-chain actions
- Network selection (Mainnet, Testnet, Devnet)
- Devnet as default network for safety
- Confirmation checkbox requirement
- Automatic lock/unlock on network changes
- Visual indicators for locked state

### ✅ Testing
- Comprehensive Vitest unit tests
- Tests for client, cache, hooks, and components
- Mock support for external APIs
- Component testing with React Testing Library

### 🔄 CI/CD
- GitHub Actions workflow
- Multi-version Node.js testing
- Linting, type checking, and testing
- Build verification
- Optional coverage reporting

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: BullX API URL (defaults to https://api.bullx.io/v1)
VITE_BULLX_API_URL=https://api.bullx.io/v1

# Optional: BullX Embed URL (defaults to https://bullx.io)
VITE_BULLX_EMBED_URL=https://bullx.io
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### BullX Metadata Client

```typescript
import { BullXMetadataClient } from './lib/bullx-client';

const client = new BullXMetadataClient({
  apiUrl: 'https://api.bullx.io/v1',
  timeout: 10000
});

const metadata = await client.getTokenMetadata('0x123...');
```

### useBullXMetadata Hook

```tsx
import { useBullXMetadata } from './hooks/useBullXMetadata';

function TokenInfo({ address }) {
  const { data, loading, error, refetch } = useBullXMetadata(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No metadata found</div>;

  return (
    <div>
      <h3>{data.name} ({data.symbol})</h3>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### BullX Embed Component

```tsx
import { BullXEmbed } from './components/BullXEmbed';

function TradingView({ tokenAddress }) {
  return (
    <BullXEmbed
      tokenAddress={tokenAddress}
      width="100%"
      height="600px"
      onError={(error) => console.error(error)}
    />
  );
}
```

### Danger Zone Component

```tsx
import { DangerZone } from './components/DangerZone';

function OnChainActions() {
  return (
    <DangerZone
      title="On-Chain Actions"
      description="These actions will execute on the blockchain"
      defaultNetwork="devnet"
      requireConfirmation={true}
      onNetworkChange={(network) => console.log('Network changed:', network)}
    >
      <button onClick={handleMint}>Mint Tokens</button>
      <button onClick={handleTransfer}>Transfer Tokens</button>
    </DangerZone>
  );
}
```

## Architecture

### Project Structure

```
dcktoolscop/
├── src/
│   ├── lib/
│   │   ├── bullx-client.ts       # BullX API client
│   │   ├── bullx-client.test.ts  # Client tests
│   │   ├── ttl-cache.ts          # TTL cache implementation
│   │   └── ttl-cache.test.ts     # Cache tests
│   ├── hooks/
│   │   ├── useBullXMetadata.ts      # React hook
│   │   └── useBullXMetadata.test.ts # Hook tests
│   ├── components/
│   │   ├── BullXEmbed.tsx           # Embed component
│   │   ├── BullXEmbed.test.tsx      # Embed tests
│   │   ├── DangerZone.tsx           # Danger zone component
│   │   └── DangerZone.test.tsx      # Danger zone tests
│   ├── test/
│   │   └── setup.ts              # Test setup
│   ├── App.tsx                   # Main application
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── .github/
│   └── workflows/
│       └── ci.yml                # CI workflow
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Design Decisions

1. **Optional BullX API URL**: The API URL is configurable via environment variables, allowing flexibility for different environments or API endpoints.

2. **In-Memory Cache with TTL**: The cache is implemented as a simple in-memory store with time-to-live expiration. This reduces API calls while ensuring data freshness.

3. **Iframe with Fallback**: The BullX embed uses an iframe for security and isolation. If the iframe fails to load, a fallback UI provides a link to open BullX in a new tab.

4. **Danger Zone Safety**: The Danger Zone component requires explicit confirmation and defaults to devnet to prevent accidental mainnet transactions.

5. **TypeScript**: Full TypeScript support with strict typing for better developer experience and fewer runtime errors.

6. **Vitest**: Modern testing framework with fast execution and great TypeScript support.

## Security Considerations

- Iframe sandbox attributes restrict potentially harmful operations
- Danger Zone requires explicit user confirmation before unlocking
- Default network is set to devnet for safety
- Network changes reset the unlocked state
- Environment variables for sensitive configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- BullX for providing the trading terminal and metadata API
- React and Vite for the modern development experience
- Vitest for the excellent testing framework
