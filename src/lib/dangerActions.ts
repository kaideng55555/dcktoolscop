// Simulated on-chain action helpers for Danger Zone (safe for CI).
// These helpers enforce devnet-only usage via the isDevnetRpc check and
// return simulated receipts so tests and CI do not require a live wallet.

import { isDevnetRpc } from './solanaWallets';

export type SimulatedReceipt = {
  success: boolean;
  action: string;
  txId: string;
  simulated: true;
  timestamp: number;
};

async function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDevnetOrThrow(rpcUrl?: string) {
  if (!isDevnetRpc(rpcUrl)) {
    throw new Error('Danger Zone actions are allowed only on devnet');
  }
}

async function makeSimulatedReceipt(action: string): Promise<SimulatedReceipt> {
  // small deterministic-ish simulation
  await delay(50);
  return {
    success: true,
    action,
    txId: `SIM_${action.toUpperCase()}_${Date.now()}`,
    simulated: true,
    timestamp: Date.now(),
  };
}

export async function simulatedMint(params: { rpcUrl?: string; amount?: number; mintAddress?: string }) {
  ensureDevnetOrThrow(params.rpcUrl ?? process.env.VITE_SOLANA_RPC_DEVNET);
  return makeSimulatedReceipt('mint');
}

export async function simulatedBurn(params: { rpcUrl?: string; amount?: number; tokenAddress?: string }) {
  ensureDevnetOrThrow(params.rpcUrl ?? process.env.VITE_SOLANA_RPC_DEVNET);
  return makeSimulatedReceipt('burn');
}

export async function simulatedFreeze(params: { rpcUrl?: string; tokenAddress?: string }) {
  ensureDevnetOrThrow(params.rpcUrl ?? process.env.VITE_SOLANA_RPC_DEVNET);
  return makeSimulatedReceipt('freeze');
}

export async function simulatedThaw(params: { rpcUrl?: string; tokenAddress?: string }) {
  ensureDevnetOrThrow(params.rpcUrl ?? process.env.VITE_SOLANA_RPC_DEVNET);
  return makeSimulatedReceipt('thaw');
}

export default {
  simulatedMint,
  simulatedBurn,
  simulatedFreeze,
  simulatedThaw,
};
