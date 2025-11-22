## Quick orientation for code-writing agents

This repo is a small Vite/React TypeScript toolset for Solana wallets/tokens ("DCK Tools Cop"). These notes capture the real structure and current placeholder state so agents can plug in safely.

**Big picture architecture**
- Single-page React app bootstrapped by `src/main.tsx` (mounts `App` and loads `neon-theme.css`).
- `src/App.tsx` is a thin layout shell that wires together feature panels: `WalletPanel`, `LiveSolPriceContainer`, `CurveSniperPanel`, and `SwapWidget`.
- Solana client config is centralized in `src/config/solana.ts` (creates a shared `Connection` from `VITE_RPC_URL`).
- Realtime/infra concerns live under `src/services/` (e.g. `websocket.ts`), while trading/sniping logic lives under `src/sniper/` and UI glue under `src/components/`.

**Key files to understand first**
- `src/App.tsx` — overall page layout and how major components fit together.
- `src/components/CurveSniperPanel.tsx` — user-facing "Curve Sniper" form; fetches market data and calls `SnipeButton`.
- `src/components/SnipeButton.tsx` — button component that invokes the `useQuickSnipe` hook.
- `src/hooks/useQuickSnipe.ts` — placeholder Solana transaction builder for "quick snipe" using wallet-adapter + `@solana/spl-token`.
- `src/hooks/useMarketData.ts` — token market data hook (currently calls a placeholder HTTP API, not Jupiter/Raydium).
- `src/services/websocket.ts` — browser websocket client stub for talking to a backend (e.g. Python `ws_engine.py`).
- `src/data/tokenNormalizer.ts` / `tokenTypes.ts` — token metadata utilities and shared TS types.

**Patterns & conventions in this repo**
- React components are small and compose hooks: data fetching hooks in `src/hooks/`, UI in `src/components/`, pure math/logic in `src/sniper/` and `src/data/`.
- Solana access on the frontend is always done through `@solana/wallet-adapter-react` + a shared `Connection` from `config/solana.ts`; prefer reusing these instead of constructing new clients.
- The "sniper" path is split: prediction/math helpers (`sniper/bondingCurvePredictor.ts`, `sniper/curveEdgeSniper.ts`) are pure; side-effecting code (signing, sending tx) lives in hooks/components.
- Several pieces are **explicitly placeholders**: `WalletPanel` shows static text, `SwapWidget` has no swap logic, `useMarketData` points at `https://api.placeholder.com/...`, and `useQuickSnipe` builds an empty `Transaction`.

**External dependencies & integration points**
- Solana: `@solana/web3.js` (connection, `Transaction`, `PublicKey`), `@solana/spl-token` (associated token accounts), and `@solana/wallet-adapter-*` (wallet connection + `sendTransaction`).
- Charts & UI: `recharts` for token/price charts (see `TokenPriceChart.tsx`), plain CSS via `neon-theme.css`.
- Realtime/backend: `socket.io-client` and `services/websocket.ts` are intended to talk to a Python backend (e.g. `backend/ws_engine.py` in sibling folders), but the frontend does not hard-code URLs yet.

**Build, test, and typecheck workflows**
- Dev server: `npm run dev` (Vite).
- Production build: `npm run build`.
- Type-only check: `npm run typecheck` (TS `--noEmit`).
- Tests: `npm run test` (Vitest, configured via `src/setupTests.ts`).
- Lint: `npm run lint` (ESLint + TypeScript/React plugins).

**When extending features as an AI agent**
- For wallet flows, implement `components/WalletPanel.tsx` using `@solana/wallet-adapter-react` and `@solana/wallet-adapter-react-ui` (connect/disconnect + show current `publicKey`). Keep it self-contained and reusable.
- For sniping, evolve `useQuickSnipe` and `SnipeButton` together: keep pure math in `sniper/*`, and only do `Transaction` construction + `sendTransaction` inside the hook.
- For swaps or price quotes, wire `SwapWidget` and `useMarketData` to a real DEX/quote API (e.g. Jupiter) **behind a single hook** so components stay thin.
- Reuse `config/solana.ts` for any new Solana RPC calls; avoid scattering `new Connection(...)` across components.

**Where to look next (quick map)**
- `src/components/` — main UI pieces, including `CurveSniperPanel`, `LiveSolPriceContainer`, `SnipeButton`, `SwapWidget`, `WalletPanel`.
- `src/hooks/` — data + transaction hooks like `useMarketData`, `useQuickSnipe`.
- `src/sniper/` — bonding-curve prediction and edge-sniping helpers.
- `src/services/` — websocket / realtime infrastructure.
- `package.json` — scripts and dependency list you must update when adding SDKs.
