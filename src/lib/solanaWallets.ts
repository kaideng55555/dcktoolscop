// Minimal wallet wiring utilities (Phantom + Solflare) for browser apps.
export type WalletProvider = 'phantom' | 'solflare';

export function isDevnetRpc(url?: string) {
  if (!url) return false;
  return url.includes('devnet') || url.includes('solana-devnet');
}
