# Kid$ Wif Tools — Solana Utility App (lite)

[![Validate Metadata](https://github.com/kaideng55555/dcktools-metadata/actions/workflows/validate.yml/badge.svg)](https://github.com/kaideng55555/dcktools-metadata/actions/workflows/validate.yml)

This ZIP already includes the **fixed full app** in `src/App.tsx`.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints.

### Optional features

If you want OpenBook/Raydium features, install their SDKs and flip the flags at the top of `src/App.tsx`:

```ts
const FEATURES = { openbook: true, raydium: true }
```

### Notes

- We use `getParsedAccountInfo` for mint detection (more version-proof than `splToken.getMint`).
- CSV tool defaults to **Aggregate** duplicates, zero-amount rows blocked (toggleable in UI).
