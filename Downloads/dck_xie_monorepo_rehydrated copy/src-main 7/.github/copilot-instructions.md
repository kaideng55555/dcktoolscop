# 🤖 Copilot Instructions for DCK Tools

This repository powers a **street art cyberpunk** trading platform for **Solana tokens, NFTs, and DeFi**. Built with React, TypeScript, Vite, and neon graffiti UI aesthetics. The codebase emphasizes visual impact, real-time data feeds, and underground culture vibes.

---

## 🚨 Critical Guidelines - Read First

### Sensitive Areas & Prohibited Changes
**DO NOT modify or create these files/areas without explicit approval:**
- `.env`, `.env.example` - Environment configuration (read-only for reference)
- `.github/workflows/` - CI/CD workflows (changes require maintainer approval)
- `package.json` dependencies - Do not add/update packages without security review
- `backend/` Python backend - Frontend-focused changes only unless specified
- Private keys, wallet seeds, API keys - Never commit these in ANY form
- Git history - Never use `git reset`, `git rebase`, or force push
- `.gitignore` - Do not remove existing exclusions without approval

**Critical Production Components - Handle with Care:**
- `src/data/FeedBoot.ts` - Core token discovery system
- `src/live/LiveFeedEngine.ts` - Real-time WebSocket engine
- `src/feed/GlobalFeedStore.ts` - Global state management
- `src/swap/jupiterClient.ts` - Trading execution logic
- All files in `/components` with `DCK` prefix - Production-tested reusable components

### Security Requirements
**You MUST adhere to these security practices:**
1. **No Secrets in Code**: Never hardcode API keys, private keys, RPC URLs, or credentials
2. **Environment Variables**: Use `import.meta.env.VITE_*` for all configuration
3. **Input Validation**: Always validate user input, especially for amounts, addresses, and transaction data
4. **XSS Prevention**: Sanitize any data rendered to DOM, especially token metadata (names, symbols)
5. **Dependency Security**: Do not add dependencies without first checking for known vulnerabilities
6. **Wallet Security**: Never request private keys; only use wallet adapter signing methods
7. **Transaction Safety**: Always show transaction details before user confirmation
8. **Error Messages**: Do not expose sensitive information in error messages or logs

### PR Acceptance Criteria
**A pull request is considered "Done" when ALL of these are met:**
- [ ] Code passes all CI checks: `npm run lint`, `npm run type-check`, `npm run build`
- [ ] Tests pass: `npm run test:run` with appropriate coverage for new code
- [ ] No new ESLint errors introduced (warnings up to 50 allowed)
- [ ] TypeScript strict mode compliance (no `any` types without justification)
- [ ] UI changes match neon cyberpunk aesthetic (dark theme, neon accents, proper fonts)
- [ ] Sound effects integrated where appropriate (interactive elements)
- [ ] Real-time data includes null checks and loading states
- [ ] Environment variables use `VITE_` prefix and have fallbacks
- [ ] Changes follow existing patterns (Logic → Hook → UI for complex features)
- [ ] No hardcoded values that should be in env vars or config
- [ ] Security checklist reviewed for sensitive changes (wallet, swap, sniper features)
- [ ] Documentation updated if public APIs or conventions changed
- [ ] No sensitive information committed (keys, secrets, personal data)
- [ ] Git commit messages are clear and descriptive
- [ ] PR description explains what changed and why

**Testing Requirements by Change Type:**
- **Pure Logic** (analyzers, calculators): Unit tests with 80%+ coverage
- **React Hooks**: Hook tests with mocked dependencies
- **UI Components**: Visual verification + critical path testing
- **Sniper/Swap Systems**: Integration tests with mocked network
- **Feed System**: Real-time update tests with mock WebSocket

---

## ⚡ Quick Start Commands

**Before making any changes, run these commands to verify your setup:**
```bash
# Install dependencies
npm install

# Verify everything works
npm run lint        # Should pass with ≤50 warnings
npm run type-check  # Should pass with no errors
npm run test:run    # Should pass all tests
npm run build       # Should build successfully
```

**Common Development Workflow:**
```bash
# 1. Start dev server
npm run dev         # Frontend on http://localhost:5173

# 2. Make changes and verify continuously
npm run lint        # Check code style
npm run type-check  # Verify TypeScript types

# 3. Test your changes
npm test           # Watch mode for iterative development
npm run test:run   # Single run for CI validation

# 4. Before committing
npm run build      # Ensure production build works
```

**Key Environment Variables** (see `.env.example`):
- `VITE_SOLANA_RPC_URL` - Solana RPC endpoint (required)
- `VITE_API_URL` - Backend API URL (optional, has mock mode)
- `VITE_WS_URL` - WebSocket URL (optional, has mock mode)
- `VITE_NETWORK` - Network type: `mainnet-beta` or `devnet`

---

## 🏗️ Big Picture Architecture

- **Purpose**: High-performance dashboard for trading/analyzing Solana tokens with real-time data and risk assessment.
- **Framework**: React 18, TypeScript 5.2, Vite 5, React Router v7 (data router APIs).
- **Styling**: Tailwind CSS v4 with custom neon theme (`styles/dckNeonTheme.ts` + `dckNeonTheme.css`).
- **Entry Point**: `src/main.tsx` initializes React. `src/App.tsx` handles routing, global state, and feed initialization.
- **Architecture**: Multi-layered with separation of concerns:
    - **UI Layer**: `/components` (Production, DCK-prefixed) & `/src/components` (Feature-specific).
    - **Data Layer**: `/src/data` (Singleton FeedBoot, normalizers, analyzers, type definitions).
    - **Feed Layer**: `/src/feed` (Zustand GlobalFeedStore) & `/src/live` (Pure TS LiveFeedEngine).
    - **Business Logic**: `/src/[feature]` (e.g., `sniper/`, `swap/`, `portfolio/`) - pure TS classes.
    - **React Integration**: `/src/hooks` or `/src/[feature]/hooks` - React adapters for business logic.
    - **State Management**: Multiple Zustand stores in `/src/stores` (feed, swap, alerts, wallet, portfolio) with localStorage persistence.

## 🔑 Key Components & Services

### Data Flow Architecture (Critical to Understand)
1. **FeedBoot** (`src/data/FeedBoot.ts`): Singleton that discovers tokens from Raydium/Pump.fun on app startup. Must reach 50 tokens before app displays (shows `GlobalLoadingScreen`).
2. **LiveFeedEngine** (`src/live/LiveFeedEngine.ts`): Pure TypeScript websocket engine (NO React/Zustand). Subscribes to real-time price/volume updates per mint.
3. **FeedNormalizer** (`src/feed/FeedNormalizer.ts`): Pure TS transformer that converts raw API data → normalized `Token` objects.
4. **GlobalFeedStore** (`src/feed/GlobalFeedStore.ts`): Zustand store that bridges LiveFeedEngine → React. Components subscribe to this store, never directly to LiveFeedEngine.
5. **Analyzers** (`src/data/*Analyzer.ts`): Pure functions that enrich `Token` objects with computed fields (authority risk, bonding curve, liquidity).

### Component Organization
- **Production Components** (`/components`): Prefixed with `DCK` (e.g., `DCKNeonChart`). Must use named exports. Stable, reusable across app.
- **Feature Components** (`/src/components`): Feature-specific UI (e.g., `SnipeButton`, `SwapModal`). Default exports allowed.
- **Feature Logic → Hook → UI Pattern**: Complex features follow this structure:
  - **Logic**: Pure TypeScript class in `/src/[feature]` (e.g., `src/sniper/curveEdgeSniper.ts`).
  - **Hook**: React adapter in `/src/hooks` or `/src/[feature]/hooks` (e.g., `useCurveEdgeSniper.ts`). Manages state, intervals, subscriptions.
  - **UI**: React component in `/src/components` (e.g., `CurveSniperPanel.tsx`). Renders hook data.

### Critical Services
- **Wallet Integration**: 
    - `src/walletTerminal/`: Multi-wallet terminal with 3s auto-sync. Zustand store (`walletStore.ts`) persists to localStorage.
    - `contexts/WalletContext.tsx`: Ethereum/EVM wallet context (ethers v6).
    - `@solana/wallet-adapter-react`: Solana wallet integration.
- **Swap Engine** (`src/swap/`): Jupiter V6 aggregator + Jito MEV protection. See expanded section below.
- **Sniper Systems** (`src/sniper/`): 6 automated trading modules (S1-S6). See expanded section below.
- **Sound Effects** (`src/sfx/`): Global singleton with 150ms cooldown. Use `useSFX()` hook → `play('shotgun')`. See `src/sfx/README.md`.
- **Routing**: Defined in `src/App.tsx`. Routes: `/explorer`, `/terminal/:mint`, `/wallets`, `/portfolio`, `/alerts`, `/nft`, `/sniper`.

## 📜 Project Conventions (Must Follow)

### Component Naming & Exports
- **Production Components** (`/components`): Must be prefixed with `DCK`. Use **named exports only**.
  ```tsx
  // ✅ Correct
  export const DCKHeader: React.FC = () => { ... }
  
  // ❌ Wrong
  export default DCKHeader;
  ```
- **Feature Components** (`/src/components`): No prefix required. Default exports allowed.
  ```tsx
  // ✅ Both acceptable
  export default SwapModal;
  export const SwapModal: React.FC = () => { ... }
  ```

### Styling Conventions
- **Tailwind Utilities Only**: No inline `style={}` objects. Use Tailwind classes.
- **Theme Constants**: Import from `styles/dckNeonTheme.ts`. Key colors from actual theme:
  ```typescript
  // Primary brand colors (from dckNeonTheme.ts)
  neonCyan = "#00F5FF"      // Primary accent (bright neon cyan)
  neonPink = "#FF1493"      // Secondary accent (hot pink)
  neonBlue = "#1E90FF"      // Electric blue
  neonPurple = "#8A2BE2"    // Blue violet
  neonOrange = "#FF9500"    // Warning
  neonYellow = "#FFD700"    // Highlights
  
  // Tailwind custom colors (from tailwind.config.js)
  neonPink = "#FF41D6"      // Used in CSS utilities
  neonCyan = "#00F5FF"      // Used in CSS utilities
  neonPurple = "#A855F7"    // Tailwind variant
  ```
- **Aesthetic Requirements**:
  - Dark backgrounds: `#0B0B0F` (main), `#161621` (cards), `#1D1D2A` (hover)
  - Neon text: Use `text-[#00F5FF]` or apply `neon-text` CSS class for glowing effect
  - Headers: Font family `Rubik Glitch` (preferred) or `Orbitron` (fallback) for cyberpunk aesthetic
  - Animations: Use Tailwind animation classes from config:
    - `animate-neonPulse` — Pulsing neon glow effect
    - `animate-glowPulse` — Glow animation for emphasis
    - `animate-goldPulse` — Gold highlight pulse
    - `animate-float` — Floating motion
    - `animate-scanline` — Retro scanline effect
  - CSS utility classes: `neon-text`, `neon-glow`, `neon-border` (from `dckNeonTheme.css`)
- **Gradients**: Use Tailwind utilities with neon colors:
  ```tsx
  <div className="bg-gradient-to-r from-[#00F5FF] via-[#8A2BE2] to-[#FF1493]">
  ```

### Sound Effects Integration
- **Always use `useSFX()` hook** for interactive elements (clicks, triggers, executions).
- **Sound types**: `shotgun`, `sniperReady`, `alert`, `buy`, `sell`, `rug`
- **Pattern**:
  ```tsx
  const { play } = useSFX();
  const handleAction = () => {
    play('shotgun'); // Play sound first
    executeAction(); // Then perform action
  };
  ```
- **No spam**: SFX engine has 150ms cooldown per sound type.

### State Management (Zustand)
- **Store Locations**: All stores in `/src/stores`, `/src/feed`, or `/src/[feature]`.
- **Naming**: Must end with `Store` (e.g., `swapStore.ts`, `walletStore.ts`).
- **Persistence**: Use `persist` middleware for user settings, wallet data, alert history.
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';
  
  export const useMyStore = create(
    persist(
      (set, get) => ({ /* state */ }),
      { name: 'dck-my-feature-storage' }
    )
  );
  ```
- **No prop drilling**: Use Zustand selectors to minimize re-renders:
  ```tsx
  // ✅ Correct - specific selector
  const tokens = useGlobalFeedStore(state => state.tokens);
  
  // ❌ Wrong - subscribes to entire store
  const { tokens, subscribeTo, getToken } = useGlobalFeedStore();
  ```

### Environment Variables
- **Vite convention**: All env vars must be prefixed with `VITE_`
- **Access**: Use `import.meta.env.VITE_*` (NOT `process.env`)
- **Required vars**:
  - `VITE_SOLANA_RPC_URL` - Solana RPC endpoint
  - `VITE_API_URL` - Backend API URL (optional for mock mode)
  - `VITE_WS_URL` - WebSocket URL (optional for mock mode)
  - `VITE_NETWORK` - Network identifier (mainnet-beta/devnet)
- **Fallbacks**: Always provide devnet fallbacks for development:
  ```typescript
  const RPC = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  ```

### Data Validation (Critical)
- **Real-time data is ALWAYS nullable**. Guard against missing fields:
  ```tsx
  // ✅ Correct
  if (!token.price || !token.market?.marketCap) {
    return <LoadingState />;
  }
  
  // ❌ Wrong - will crash on missing data
  const formatted = `$${token.market.marketCap.toFixed(2)}`;
  ```
- **Use TypeScript optional chaining**: `token.metadata?.name ?? 'Unknown'`
- **Analyzers add computed fields**: Check `src/data/*.md` for available fields (e.g., `authorityRiskScore`, `bondingProgress`).

## 💻 Developer Workflow

### Local Development
- **Dev Server**: `npm run dev` (Vite hot reload on http://localhost:5173)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview Build**: `npm run preview` (test production build locally)
- **Type Check**: `npm run type-check` (TSC without emit)
- **Linting**: `npm run lint` (ESLint - allows up to 50 warnings)

### VS Code Tasks (⇧⌘P → "Tasks: Run Task")
- **backend:python (8000)** - Start FastAPI backend server
- **frontend:vite (5173)** - Start Vite dev server with hot reload
- **run:backend+frontend** - Start both backend and frontend together
- **stop:all** - Kill all running development servers

### VS Code Debug Configurations
- **Python: FastAPI (8000)** - Debug FastAPI backend with breakpoints
- **Chrome: Vite (5173)** - Debug frontend in Chrome DevTools
- **Full Stack Debug** - Debug both backend and frontend simultaneously

### Testing
- **Watch Mode**: `npm test` (Vitest with hot reload)
- **Single Run**: `npm run test:run`
- **Coverage**: `npm run test:coverage` (generates coverage report)
- **UI Mode**: `npm run test:ui` (Vitest UI at http://localhost:51204)
- **Setup**: Test environment configured with jsdom, setup file at `src/test/setup.ts`

### ESLint Configuration
- **Uses ESLint v9 flat config** (`eslint.config.js`, NOT `.eslintrc`)
- **Key rules**:
  - `@typescript-eslint/no-explicit-any`: warn (not error)
  - `@typescript-eslint/no-unused-vars`: warn with `_` prefix ignore
  - `react-hooks/rules-of-hooks`: error
  - `react-refresh/only-export-components`: warn
  - Max warnings: 50 (use `npm run lint:strict` for 0 warnings)

### Feed Initialization Flow
1. `App.tsx` mounts → calls `FeedBoot.start()`
2. FeedBoot discovers tokens from Raydium/Pump.fun (polling + transaction logs)
3. Shows `GlobalLoadingScreen` until 50 tokens loaded
4. GlobalFeedStore initializes LiveFeedEngine for websocket subscriptions
5. Components subscribe via `useGlobalFeedStore()` hook
6. Real-time updates flow: LiveFeedEngine → FeedNormalizer → GlobalFeedStore → React components

## 🚀 Deployment (Vercel)

- **Platform**: Vercel (Vite preset).
- **Configuration**: `vercel.json` handles SPA routing and caching.
- **Build Settings**:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- **Environment Variables**: Required for production (Mainnet):
  - `VITE_SOLANA_RPC_URL=https://wispy-purple-cloud.solana-mainnet.quiknode.pro/f96d6af1655da56c22e185d732801d7664692a9f/`
  - `VITE_API_URL=https://your-backend-api.com`
  - `VITE_WS_URL=wss://wispy-purple-cloud.solana-mainnet.quiknode.pro/f96d6af1655da56c22e185d732801d7664692a9f/`
  - `VITE_NETWORK=mainnet-beta`
- **Asset Caching**: Static assets cached for 1 year (immutable)
- **SPA Rewrites**: All routes rewrite to `/index.html` for client-side routing

## ⚡️ Common Patterns & Examples

### Feed System Access
Access normalized token data through global stores.
```typescript
import { useGlobalFeedStore } from '../feed/GlobalFeedStore';

const MyComponent = () => {
  const { tokens, subscribeTo } = useGlobalFeedStore();
  // Subscribe to a token to get real-time updates
  useEffect(() => {
    subscribeTo('MintAddress...');
  }, []);
};
```

### Data Validation
Always guard against missing data in real-time feeds.
```typescript
if (!token.price || !token.market?.marketCap) {
  return <LoadingState />;
}
```

### Feature Component Structure
Complex features follow a **Logic → Hook → Component** pattern:
1.  **Logic**: Core business logic in `src/[feature]/` (e.g., `src/sniper/lp/lpEventSniper.ts`).
2.  **Hook**: React adapter in `src/hooks/` or `src/[feature]/hooks/` (e.g., `useLpEventSniper.ts`).
3.  **UI**: Visual components in `src/components/[feature]/` (e.g., `src/components/sniper/LpSniperPanel.tsx`).

```typescript
// Example: src/components/sniper/SniperBot.tsx
const SniperBot: React.FC = () => {
  const { opportunities, startMonitoring } = useLpEventSniper(); // Hook
  const { play } = useSFX(); // Sound effects
  // ...
};
```

### Zustand Store Best Practices
```typescript
// ✅ Correct - Use selectors to avoid re-renders
const tokens = useGlobalFeedStore(state => state.tokens);
const subscribeTo = useGlobalFeedStore(state => state.subscribeTo);

// ❌ Wrong - Subscribes to entire store, causes unnecessary re-renders
const store = useGlobalFeedStore();
```

### Sound Effects Pattern
```typescript
import { useSFX } from '../sfx/useSFX';

function SnipeButton() {
  const { play } = useSFX();
  
  const handleSnipe = () => {
    play('shotgun'); // Sound plays first
    executeSnipe();   // Then action
  };
  
  return <button onClick={handleSnipe}>Snipe</button>;
}
```

## 🔍 Files to Inspect First

- `src/App.tsx`: Main routing and app initialization logic.
- `src/data/FeedBoot.ts`: The heart of the token discovery system.
- `src/data/*.md`: **Critical documentation** for data analyzers (e.g., `AUTHORITY_ANALYZER_USAGE.md`).
- `styles/dckNeonTheme.ts`: Design system tokens.
- `src/feed/GlobalFeedStore.ts`: Real-time data store.
- `src/data/tokenTypes.ts`: Core data models.
- `package.json`: Dependencies (note `react-router-dom` v7, `tailwindcss` v4).

---

## 🔄 Swap Engine (Jupiter V6 + Jito MEV)

### Architecture Overview
```
UI Component (SwapModal)
    ↓
useSwapEngine (React Hook)
    ↓
┌──────────────────┬─────────────────┐
│ Jupiter Client   │  Jito Client    │
│ (Best Routes)    │  (MEV Protection)│
└──────────────────┴─────────────────┘
    ↓
Solana Network (Swap Execution)
```

### File Structure
- **`swapTypes.ts`**: All TypeScript interfaces (`SwapRequest`, `SwapResult`, `RouteInfo`, `SwapFees`)
- **`jupiterClient.ts`**: Jupiter V6 API integration for route discovery
- **`jitoClient.ts`**: Jito MEV protection (tip attachment to transactions)
- **`useSwapEngine.ts`**: Main React hook for UI integration
- **`swapStore.ts`**: Zustand store for swap modal state

### Critical Types
```typescript
interface SwapRequest {
  inputMint: string;        // SOL, USDC, etc.
  outputMint: string;       // Target token
  amountIn: number;         // In base units (lamports)
  slippage: number;         // Basis points (50 = 0.5%)
  useJito: boolean;         // Enable MEV protection
  jitoTipAmount?: number;   // Optional tip in SOL
}

interface SwapResult {
  signature: string;        // Transaction signature
  outputAmount: string;     // Actual tokens received
  priceImpact: number;      // Price impact %
  fees: SwapFees;          // Breakdown of all fees
  timestamp: number;        // Execution timestamp
}
```

### Usage Pattern
```typescript
import { useSwapEngine } from '../swap/useSwapEngine';

const { fetchRoutes, executeSwap, bestRoute, isLoading, error } = useSwapEngine({
  connection,
  wallet,
});

// Step 1: Fetch best routes
await fetchRoutes({
  inputMint: 'So11111111111111111111111111111111111111112', // SOL
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amountIn: 1_000_000_000, // 1 SOL
  slippage: 50, // 0.5%
  useJito: true,
});

// Step 2: Execute swap with best route
if (bestRoute) {
  const result = await executeSwap({
    route: bestRoute,
    priorityFee: 10_000, // 0.00001 SOL
  });
}
```

### Jito MEV Protection
- **When to use**: Large swaps (>10 SOL), high-traffic tokens, frontrun-vulnerable trades
- **Tip amounts**: `LOW` (0.00001 SOL), `MEDIUM` (0.0001 SOL), `HIGH` (0.001 SOL), `TURBO` (0.01 SOL)
- **Implementation**: Tip attached as additional instruction to swap transaction
- **Validation**: `validateTipAmount()` ensures tip is within safe range

### Route Freshness
- Routes expire after **30 seconds** (Jupiter recommendation)
- Auto-refresh pattern:
  ```typescript
  useEffect(() => {
    const interval = setInterval(() => refreshRoutes(), 10_000);
    return () => clearInterval(interval);
  }, [refreshRoutes]);
  ```

### Error Handling
```typescript
// Error codes to handle
switch (error?.code) {
  case 'WALLET_NOT_CONNECTED': // Prompt wallet connection
  case 'INSUFFICIENT_BALANCE': // Show balance error
  case 'ROUTE_NOT_FOUND': // No liquidity available
  case 'SLIPPAGE_EXCEEDED': // Increase slippage or reduce amount
  case 'TRANSACTION_FAILED': // Retry with higher priority fee
}
```

---

## 🎯 Sniper Systems (S1-S6)

The platform includes **6 specialized sniper modules** for automated trading. Each follows the **Logic → Hook → UI** pattern.

### S1: Quick Snipe (Manual)
**Purpose**: Lightning-fast manual snipe for fresh tokens (<2 min old)

**Files**:
- Logic: Built into `SnipeButton` component
- Hook: `useQuickSnipe()` hook
- UI: `src/components/SnipeButton.tsx`

**Key Features**:
- Pulsing neon border for tokens <2 min old
- Preset turbo config: 10% slippage, Jito enabled, 0.1 SOL buy
- Shotgun sound effect on click
- Gradient: Pink → Purple → Cyan

**Usage**:
```tsx
<SnipeButton tokenMint={token.mint} createdAt={token.createdAt} />
```

---

### S2: Curve Edge Sniper (Automated)
**Purpose**: Snipe tokens at 95-99% bonding curve completion, before Raydium migration

**Files**:
- Logic: `src/sniper/curveEdgeSniper.ts`
- Hook: `src/sniper/hooks/useCurveEdgeSniper.ts`
- UI: `src/components/CurveSniperPanel.tsx`

**Strategy**: Buy right before graduation → Sell after migration liquidity boost

**Key Metrics**:
```typescript
interface SnipeOpportunity {
  bondingProgress: number;      // 95-99% target range
  estimatedGradTime: number;    // Seconds until graduation
  velocity: number;             // Speed score (0-100)
  confidence: number;           // AI confidence (0-100)
  recommendation: "BUY_NOW" | "WAIT" | "SKIP";
}
```

**Configuration**:
```typescript
const config: CurveEdgeConfig = {
  minProgress: 95,      // Start monitoring at 95%
  maxProgress: 99,      // Execute before 99%
  snipeAmount: 0.1,     // SOL per snipe
  autoExecute: true,    // Auto-buy on high confidence
  stopLoss: 20,         // 20% stop loss
  takeProfit: 50,       // 50% take profit
  useJito: true,        // MEV protection
};
```

**Sound Effect**: `sniperReady` (plays when confidence ≥75%)

---

### S3: Hot Buy Bot (Rule-Based)
**Purpose**: Automated buys based on configurable metric triggers

**Files**:
- Logic: `src/sniper/hotBuyBot.ts`
- Hook: `src/hooks/useHotBuyBot.ts`
- UI: `src/components/HotBuyBotPanel.tsx` (if exists)

**Rule Types**:
- `MARKET_CAP_SPIKE`: Buy when MC increases X%
- `VOLUME_SURGE`: Buy when 24h volume spikes
- `FRESH_TOKEN`: Buy tokens <5 min old matching criteria
- `BONDING_THRESHOLD`: Buy at specific bonding %
- `VELOCITY_SPIKE`: Buy on high velocity score

**Example Rule**:
```typescript
const rule: HotBuyRule = {
  id: '1',
  name: 'Fresh Safe Tokens',
  type: 'FRESH_TOKEN',
  enabled: true,
  buyAmount: 0.05, // 0.05 SOL
  safety: {
    lpSafe: true,           // Require min 5 SOL liquidity
    authoritySafe: true,    // No mint/freeze authority
    rugSafe: true,          // Not flagged as dead
    minConfidence: 60,      // Min 60% confidence
    minAge: 120,            // Min 2 min old
  },
  trigger: {
    maxMarketCap: 50_000,   // Under $50k MC
    minLiquidity: 5,        // At least 5 SOL LP
  },
};
```

**Sound Effects**:
- `alert`: When rule triggers (pending execution)
- `buy`: On successful trade
- `rug`: On failed trade

---

### S4: LP Event Sniper (Liquidity Monitoring)
**Purpose**: Monitor LP additions/removals and snipe on favorable events

**Files**:
- Logic: `src/sniper/lp/lpEventSniper.ts`
- Hook: `src/hooks/useLpEventSniper.ts`
- UI: `src/components/LpSniperPanel.tsx` (if exists)

**Tracked Events**:
- `LP_ADDED`: New liquidity added
- `LP_SURGE`: Large LP increase (>50%)
- `LP_LOCKED`: LP tokens locked
- `LP_BURNED`: LP tokens burned (bullish signal)
- `LP_DRAIN`: LP being removed (warning)
- `LP_RUG`: LP pulled to zero (danger)

**Scoring System** (0-100):
```typescript
interface LPScore {
  liquidityScore: number;   // LP amount relative to MC
  velocityScore: number;    // Rate of LP change
  stabilityScore: number;   // LP consistency over time
  safetyScore: number;      // Lock/burn status
  totalScore: number;       // Weighted average
}
```

**Opportunity Threshold**: Score ≥70 triggers `sniperReady` sound

---

### S5: Smart Limits (Auto Buy/Sell)
**Purpose**: Automated limit orders (buy below price, sell above price)

**Files**:
- Logic: `src/sniper/limits/limitTrader.ts`
- Hook: `src/sniper/limits/useLimitTrader.ts`
- UI: `src/components/SmartLimitsPanel.tsx` (if exists)

**Rule Structure**:
```typescript
interface LimitRule {
  id: string;
  tokenMint: string;
  type: "BUY_LIMIT" | "SELL_LIMIT" | "STOP_LOSS" | "TAKE_PROFIT";
  triggerPrice: number;     // Target price
  amount: number;           // SOL or token %
  enabled: boolean;
  expiry?: number;          // Optional expiration timestamp
}
```

**Execution Flow**:
1. Monitor token price every 1 second
2. Evaluate all enabled rules
3. Execute when trigger conditions met
4. Record execution in history
5. Disable/remove executed one-time rules

**Sound Effects**:
- `buy`: On BUY_LIMIT execution
- `sell`: On SELL_LIMIT/TAKE_PROFIT execution
- `rug`: On failed execution

---

### S6: Watchdog Mode (Full Auto AI)
**Purpose**: AI-powered real-time monitoring with automated actions across ALL tokens

**Files**:
- Logic: `src/watchdog/watchdogEngine.ts`
- Hook: `src/watchdog/useWatchdog.ts`
- UI: `src/watchdog/WatchdogPanel.tsx`
- Types: `src/watchdog/watchdogTypes.ts`

**Watch Conditions** (20+ triggers):
- Pool events: `NEW_POOL`, `LP_ADDED`, `LP_SURGE`, `LP_DRAIN`, `LP_RUG`, `MIGRATION`
- Bonding: `BONDING_NEAR_GRAD`, `BONDING_STALL`
- Market: `MC_SPIKE`, `MC_CRASH`, `VOLUME_SPIKE`, `VELOCITY_SPIKE`
- Whale activity: `WHALE_BUY`, `WHALE_SELL`
- Safety: `AUTHORITY_RISK`, `SAFETY_FAIL`

**Actions**:
- `BUY`: Auto-purchase on opportunity
- `SELL`: Auto-exit on danger
- `ALERT`: Notification only (no trade)
- `FREEZE`: Pause all watchdog actions

**Example Watchdog Rule**:
```typescript
const watchdogRule: WatchdogRule = {
  id: 'w1',
  name: 'Auto-snipe new safe pools',
  condition: 'NEW_POOL',
  action: 'BUY',
  amount: 0.05, // 0.05 SOL
  useSafety: true, // Enforce safety checks
  cooldown: 300, // 5 min cooldown between triggers
  maxExecutions: 10, // Max 10 executions per rule
  enabled: true,
};
```

**Sound Effect**: `alert` when watchdog triggers (not yet integrated - TODO)

---

## 🎵 Sound Effects Integration

All sniper modules integrated with SFX system (`src/sfx/`):

| Module | Sound | Trigger |
|--------|-------|---------|
| S1 Quick Snipe | `shotgun` | Button click |
| S2 Curve Edge | `sniperReady` | High confidence (≥75%) |
| S3 Hot Buy Bot | `alert`, `buy`, `rug` | Rule trigger, success, failure |
| S4 LP Event | `sniperReady` | High LP score (≥70) |
| S5 Smart Limits | `buy`, `sell`, `rug` | Execution success/failure |
| S6 Watchdog | `alert` | Condition triggered (TODO) |

### Adding Sounds to New Features
```typescript
import { useSFX } from '../sfx/useSFX';

const { play } = useSFX();

// In your logic
if (highConfidenceOpportunity) {
  play('sniperReady'); // 150ms cooldown enforced
}
```

---

## 🧪 Testing Strategy

### Testing Philosophy
- **Unit tests**: Pure logic functions (analyzers, normalizers, calculators)
- **Hook tests**: React hooks with mocked dependencies (Solana connection, wallet)
- **Integration tests**: Feature modules with real stores (but mocked network)
- **E2E tests**: Critical user flows (swap, snipe) with full stack

### Test File Organization
```
src/
  sniper/
    curveEdgeSniper.ts           # Pure logic
    curveEdgeSniper.test.ts      # Unit tests
    hooks/
      useCurveEdgeSniper.ts      # React hook
      useCurveEdgeSniper.test.ts # Hook tests
  swap/
    jupiterClient.ts             # API client
    jupiterClient.test.ts        # Mock API responses
    useSwapEngine.ts             # React hook
    useSwapEngine.test.ts        # Hook tests with wallet mock
```

### Mocking Patterns

#### Mock Solana Connection
```typescript
import { vi } from 'vitest';
import { Connection } from '@solana/web3.js';

const mockConnection = {
  getAccountInfo: vi.fn(),
  getBalance: vi.fn(),
  sendTransaction: vi.fn(),
  confirmTransaction: vi.fn(),
} as unknown as Connection;
```

#### Mock Wallet Adapter
```typescript
const mockWallet = {
  publicKey: new PublicKey('7x1g...k9mP'),
  signTransaction: vi.fn(),
  signAllTransactions: vi.fn(),
  connected: true,
} as WalletAdapter;
```

#### Mock Token Data
```typescript
const mockToken: Token = {
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  metadata: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  market: {
    price: 1.0,
    marketCap: 50_000_000,
    liquidity: 100_000,
    volume24h: 1_000_000,
  },
  bonding: {
    bondingProgress: 97.5, // High for S2 testing
    isMigrated: false,
  },
  authorities: {
    mintAuthority: null,
    freezeAuthority: null,
  },
  lpBurned: true,
  mintAuthorityDisabled: true,
  freezeAuthorityDisabled: true,
  createdAt: Date.now() - 120_000, // 2 min old
  ageMinutes: 2,
  isAlive: true,
  riskScore: 10,
};
```

### Testing Sniper Logic (Pure Functions)

**Example: S2 Curve Edge Sniper**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { CurveEdgeSniper } from '../curveEdgeSniper';

describe('CurveEdgeSniper', () => {
  let sniper: CurveEdgeSniper;
  
  beforeEach(() => {
    sniper = new CurveEdgeSniper(mockConnection, {
      minProgress: 95,
      maxProgress: 99,
      snipeAmount: 0.1,
      autoExecute: false, // Disable for testing
    });
  });
  
  it('identifies opportunities in 95-99% range', () => {
    const token = { ...mockToken, bonding: { bondingProgress: 97.5 } };
    const opportunity = sniper.evaluateToken(token);
    
    expect(opportunity).toBeDefined();
    expect(opportunity.recommendation).toBe('BUY_NOW');
    expect(opportunity.bondingProgress).toBe(97.5);
  });
  
  it('skips tokens below threshold', () => {
    const token = { ...mockToken, bonding: { bondingProgress: 92 } };
    const opportunity = sniper.evaluateToken(token);
    
    expect(opportunity.recommendation).toBe('SKIP');
  });
  
  it('calculates velocity from bonding history', () => {
    // Add snapshots: 90% → 95% → 97% over 60 seconds
    const velocity = sniper.calculateVelocity([
      { progress: 90, timestamp: Date.now() - 60000 },
      { progress: 95, timestamp: Date.now() - 30000 },
      { progress: 97, timestamp: Date.now() },
    ]);
    
    expect(velocity).toBeGreaterThan(50); // Fast graduation
  });
});
```

### Testing Swap Engine

**Example: Route Fetching**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { useSwapEngine } from '../useSwapEngine';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Jupiter API
vi.mock('../jupiterClient', () => ({
  getRoutes: vi.fn().mockResolvedValue([
    {
      inputMint: 'SOL',
      outputMint: 'USDC',
      outAmount: '1000000', // 1 USDC
      priceImpact: 0.5,
      steps: [{ protocol: 'Raydium' }],
    },
  ]),
}));

describe('useSwapEngine', () => {
  it('fetches routes successfully', async () => {
    const { result } = renderHook(() => useSwapEngine({
      connection: mockConnection,
      wallet: mockWallet,
    }));
    
    await waitFor(() => {
      result.current.fetchRoutes({
        inputMint: 'SOL',
        outputMint: 'USDC',
        amountIn: 1_000_000_000,
        slippage: 50,
        useJito: false,
      });
    });
    
    await waitFor(() => {
      expect(result.current.bestRoute).toBeDefined();
      expect(result.current.bestRoute?.priceImpact).toBeLessThan(1);
    });
  });
  
  it('handles route expiration after 30 seconds', async () => {
    const { result } = renderHook(() => useSwapEngine({
      connection: mockConnection,
      wallet: mockWallet,
    }));
    
    // Fetch route
    await result.current.fetchRoutes({ /* ... */ });
    const initialRoute = result.current.bestRoute;
    
    // Fast-forward 31 seconds
    vi.advanceTimersByTime(31_000);
    
    // Route should be marked as stale
    expect(result.current.isRouteStale()).toBe(true);
  });
});
```

### Testing React Hooks

**Example: S2 Hook with Sound Effects**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCurveEdgeSniper } from '../hooks/useCurveEdgeSniper';

// Mock SFX
vi.mock('../../sfx/useSFX', () => ({
  useSFX: () => ({
    play: vi.fn(),
    enabled: true,
    volume: 0.7,
  }),
}));

describe('useCurveEdgeSniper Hook', () => {
  it('plays sniperReady sound when confidence ≥75%', async () => {
    const { result } = renderHook(() => useCurveEdgeSniper({
      connection: mockConnection,
      autoStart: true,
    }));
    
    // Wait for monitoring to detect high-confidence opportunity
    await waitFor(() => {
      const topOpp = result.current.getTopOpportunities(1)[0];
      expect(topOpp?.confidence).toBeGreaterThanOrEqual(75);
    });
    
    // Verify sound was triggered
    expect(useSFX().play).toHaveBeenCalledWith('sniperReady');
  });
  
  it('updates opportunities every 5 seconds', async () => {
    const { result } = renderHook(() => useCurveEdgeSniper({
      connection: mockConnection,
      interval: 5000,
      autoStart: true,
    }));
    
    const initialCount = result.current.opportunities.length;
    
    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(result.current.opportunities.length).toBeGreaterThanOrEqual(initialCount);
    });
  });
});
```

### Testing Zustand Stores

**Example: Swap Store**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useSwapStore } from '../stores/swapStore';

describe('Swap Store', () => {
  beforeEach(() => {
    // Reset store state
    useSwapStore.setState({
      isSwapOpen: false,
      selectedInput: undefined,
      selectedOutput: undefined,
    });
  });
  
  it('opens swap modal with selected tokens', () => {
    const { openSwap, isSwapOpen, selectedInput } = useSwapStore.getState();
    
    openSwap('SOL', 'USDC');
    
    expect(useSwapStore.getState().isSwapOpen).toBe(true);
    expect(useSwapStore.getState().selectedInput).toBe('SOL');
    expect(useSwapStore.getState().selectedOutput).toBe('USDC');
  });
  
  it('persists to localStorage', () => {
    const { openSwap } = useSwapStore.getState();
    
    openSwap('SOL', 'USDC');
    
    // Check localStorage
    const stored = localStorage.getItem('dck-swap-storage');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!).state.isSwapOpen).toBe(true);
  });
});
```

### Integration Testing Best Practices

1. **Test Sniper Execution Flow**:
   - Mock token feed → Sniper detects opportunity → Play sound → Execute trade
   - Verify state changes at each step
   - Check sound cooldown prevents spam

2. **Test Swap Error Handling**:
   - Mock Jupiter API failures
   - Verify error states (ROUTE_NOT_FOUND, SLIPPAGE_EXCEEDED)
   - Check retry logic with exponential backoff

3. **Test Feed Initialization**:
   - Mock FeedBoot discovery
   - Verify GlobalLoadingScreen shows until 50 tokens
   - Check LiveFeedEngine subscription after ready

4. **Test Real-time Updates**:
   - Mock websocket messages
   - Verify token price updates in GlobalFeedStore
   - Check UI re-renders only for subscribed tokens

### Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Single run (CI/CD)
npm run test:run

# Coverage report
npm run test:coverage

# UI mode (visual test runner)
npm run test:ui
```

### Coverage Targets
- **Pure logic** (analyzers, calculators): 90%+ coverage
- **React hooks**: 80%+ coverage
- **UI components**: 60%+ coverage (focus on critical paths)
- **Integration tests**: Critical user flows only

### Common Testing Gotchas

1. **Async timing**: Use `waitFor` for async state updates
2. **Solana transactions**: Mock all RPC calls (expensive in tests)
3. **Sound cooldown**: Mock timers with `vi.useFakeTimers()`
4. **Zustand persistence**: Clear localStorage between tests
5. **Route expiration**: Fast-forward time with `vi.advanceTimersByTime()`

---

## 🚀 Quick Start: Environment Variables

Set these environment variables to run the app:

- `VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com`
- `VITE_API_URL=https://your-backend-api.com`
- `VITE_WS_URL=wss://your-backend-api.com`
- `VITE_NETWORK=mainnet-beta`

---

**Built with ⚡ by DCK Tools**
