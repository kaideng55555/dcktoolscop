import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

type Props = {
  children: React.ReactNode;
};

/**
 * Solana connection + wallet adapters.
 *
 * - No Keystone adapter (removes @keystonehq/sdk + react-qr-reader peer issues)
 * - Uses WalletModalProvider so you can pop a wallet picker from your UI
 */
export function SolanaProviders({ children }: Props) {
  const network = (import.meta.env.VITE_SOLANA_NETWORK ?? 'devnet') as
    | 'devnet'
    | 'testnet'
    | 'mainnet-beta';

  const endpoint = (import.meta.env.VITE_SOLANA_RPC_URL as string | undefined) ??
    clusterApiUrl(network);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
