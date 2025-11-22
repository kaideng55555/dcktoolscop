## Description
<!-- Brief summary of what this PR does and why -->

## Changes
<!-- List the key changes made -->
- 

## Checklist

### Code Quality
- [ ] Code builds successfully (`npm run build` or equivalent)
- [ ] No new linting/type errors
- [ ] Tested locally (specify: devnet/testnet/mainnet)

### Solana-Specific Patterns
- [ ] Token amount conversions use `toBaseUnits()` / `formatBaseToUiString()` (no raw JS number arithmetic)
- [ ] Transaction construction includes compute budget via `withPriority()` helper
- [ ] Wallet operations check for `wallet.publicKey` and `wallet.signTransaction` before executing
- [ ] Used `baseUnitsToNumberSafe()` when converting bigint → number for SDK calls that require it

### Feature Flags & Dependencies
- [ ] If enabling a `FEATURES` flag (OpenBook, Raydium), added corresponding SDK to `package.json`
- [ ] No heavy SDKs imported unless their feature flag is enabled
- [ ] Updated README if new dependencies or features were added

### State Management
- [ ] Changes to `kidwiftools.tokenConfig` localStorage shape include migration logic in `TokenConfigProvider`
- [ ] No breaking changes to persisted state without migration path

### Testing & Safety
- [ ] Added `console.assert()` checks for new helper functions (if applicable)
- [ ] Verified no overflow/precision loss in token math operations
- [ ] Tested with multiple wallet adapters if wallet integration changed

## Screenshots / Demo
<!-- If UI changes, include before/after screenshots or a short video -->

## Related Issues
<!-- Link any related issues: Closes #123 -->
