import React, { useMemo, useState } from 'react';
import useDangerMode from '../hooks/useDangerMode';
import { requestWalletConnection, isDevnetRpc } from '../lib/solanaWallets';

type Props = {
  rpcUrl?: string; // the app's RPC url (from env or props)
};

const DangerZone: React.FC<Props> = ({ rpcUrl }) => {
  const {
    unlocked,
    typedValue,
    setTyped,
    unlock,
    lock,
  } = useDangerMode();

  const devnetOk = useMemo(() => isDevnetRpc(rpcUrl), [rpcUrl]);

  const [walletConnected, setWalletConnected] = useState(false);

  const tryConnectWallet = async () => {
    const connected = await requestWalletConnection('phantom');
    setWalletConnected(connected);
  };

  if (!devnetOk) return <div style={{ color: 'red' }}>Danger Zone disabled (devnet only)</div>;

  if (!unlocked) {
    return (
      <div style={{ border: '1px dashed red', padding: 12 }}>
        <p>Type unlock phrase:</p>
        <input
          value={typedValue}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="UNLOCK DANGER ZONE"
          style={{ width: '100%', padding: 8, marginTop: 8 }}
        />
      </div>
    );
  }

  return (
    <div style={{ border: '2px solid red', padding: 16, marginTop: 12 }}>
      <p style={{ fontWeight: 'bold' }}>🚨 Danger Zone Unlocked</p>
      {!walletConnected ? (
        <button onClick={tryConnectWallet}>Connect Wallet</button>
      ) : (
        <p>✅ Wallet Connected</p>
      )}
      {/* Placeholder for mint/burn/freeze actions */}
      <button style={{ marginTop: 12 }} onClick={lock}>
        Lock Danger Zone
      </button>
    </div>
  );
};

export default DangerZone;
