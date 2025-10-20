// Minimal wallet wiring utilities (Phantom + Solflare) for browser apps.
export type WalletProvider = 'phantom' | 'solflare';

export function isDevnetRpc(url?: string) {
  if (!url) return false;
  return url.includes('devnet') || url.includes('solana-devnet');
}

export async function requestWalletConnection(provider: WalletProvider) {
  if (provider === 'phantom') {
    return (window as any).solana ?? null;
  }
  if (provider === 'solflare') {
    return (window as any).solflare ?? null;
  }
  return null;
}
