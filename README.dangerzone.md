# Danger Zone (devnet-only) — Overview

This feature adds a gated administrative UI for on-chain testing and admin tasks. It is intentionally devnet-first and gated behind an unlock phrase.

## Behavior

- Only works if `rpcUrl` includes `devnet`
- Requires unlock phrase: `UNLOCK DANGER ZONE`
- Requires wallet connect (currently Phantom only)
- Intended for safe re-enabling of on-chain actions like mint, freeze, burn

## Props

- `rpcUrl` — RPC endpoint (from env or user input)

