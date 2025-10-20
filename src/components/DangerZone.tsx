import React, { useMemo, useState } from 'react';
import useDangerMode from '../hooks/useDangerMode';
import { requestWalletConnection, isDevnetRpc } from '../lib/solanaWallets';

type Props = {
  rpcUrl?: string; // the app's RPC url (from env or props)
};

export default function DangerZone({ rpcUrl }: Props) {
  const { unlocked, typedValue, setTyped, lock } = useDangerMode('UNLOCK DANGER');
  const [provider, setProvider] = useState<'phantom' | 'solflare' | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [log, setLog] = useState<string[]>([]);

  const devnetOk = useMemo(() => isDevnetRpc(rpcUrl ?? (process.env.VITE_SOLANA_RPC_DEVNET as string)), [rpcUrl]);

  async function connect(providerId: 'phantom' | 'solflare') {
    setProvider(providerId);
    try {
      const w = await requestWalletConnection(providerId);
      if (!w) {
        setLog(l => [...l, `Provider ${providerId} not available in page`]);
        return;
      }
      if (w.connect) await w.connect();
      setWallet(w);
      setLog(l => [...l, `Connected ${providerId}`]);
    } catch (err: any) {
      setLog(l => [...l, `Connect error: ${String(err)}`]);
    }
  }

  function requireDevnet(): boolean {
    if (!devnetOk) {
      setLog(l => [...l, 'Danger Zone actions are allowed only on devnet.']);
      return false;
    }
    return true;
  }

  async function confirmAndRun(actionName: string, fn: () => Promise<void>) {
    const confirmText = prompt(`Type \