import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';

// Solana RPC Provider
export const getSolanaConnection = (): Connection =>
{
    const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    return new Connection( rpcUrl, 'confirmed' );
};

// EVM RPC Provider (for read-only operations)
export const getEvmProvider = (): ethers.JsonRpcProvider | null =>
{
    const rpcUrl = import.meta.env.VITE_EVM_RPC_URL;
    if ( !rpcUrl ) return null;
    return new ethers.JsonRpcProvider( rpcUrl );
};