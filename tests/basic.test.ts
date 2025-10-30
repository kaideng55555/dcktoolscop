import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isDevnetRpc, requestWalletConnection, WalletProvider } from '../src/lib/solanaWallets';
import { simulatedMint, simulatedBurn, simulatedFreeze, simulatedThaw } from '../src/lib/dangerActions';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDangerMode } from '../src/hooks/useDangerMode';

describe('Solana Wallets', () => {
  describe('isDevnetRpc', () => {
    it('should return true for devnet URLs', () => {
      expect(isDevnetRpc('https://api.devnet.solana.com')).toBe(true);
      expect(isDevnetRpc('https://solana-devnet.example.com')).toBe(true);
    });

    it('should return false for mainnet URLs', () => {
      expect(isDevnetRpc('https://api.mainnet-beta.solana.com')).toBe(false);
      expect(isDevnetRpc('https://api.testnet.solana.com')).toBe(false);
    });

    it('should return false for undefined or empty URLs', () => {
      expect(isDevnetRpc(undefined)).toBe(false);
      expect(isDevnetRpc('')).toBe(false);
    });
  });

  describe('requestWalletConnection', () => {
    beforeEach(() => {
      // Clean up window object
      delete (window as Record<string, unknown>).solana;
      delete (window as Record<string, unknown>).solflare;
    });

    it('should return phantom wallet from window.solana', async () => {
      const mockPhantom = { publicKey: 'mock-phantom-key' };
      (window as Record<string, unknown>).solana = mockPhantom;
      
      const result = await requestWalletConnection('phantom' as WalletProvider);
      expect(result).toBe(mockPhantom);
    });

    it('should return solflare wallet from window.solflare', async () => {
      const mockSolflare = { publicKey: 'mock-solflare-key' };
      (window as Record<string, unknown>).solflare = mockSolflare;
      
      const result = await requestWalletConnection('solflare' as WalletProvider);
      expect(result).toBe(mockSolflare);
    });

    it('should return null if phantom is not installed', async () => {
      const result = await requestWalletConnection('phantom' as WalletProvider);
      expect(result).toBeNull();
    });

    it('should return null if solflare is not installed', async () => {
      const result = await requestWalletConnection('solflare' as WalletProvider);
      expect(result).toBeNull();
    });
  });
});

describe('Danger Actions', () => {
  const devnetRpc = 'https://api.devnet.solana.com';
  const mainnetRpc = 'https://api.mainnet-beta.solana.com';

  describe('simulatedMint', () => {
    it('should succeed with devnet RPC', async () => {
      const result = await simulatedMint({ rpcUrl: devnetRpc, amount: 100 });
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('mint');
      expect(result.simulated).toBe(true);
      expect(result.txId).toContain('SIM_MINT_');
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should throw error with mainnet RPC', async () => {
      await expect(
        simulatedMint({ rpcUrl: mainnetRpc, amount: 100 })
      ).rejects.toThrow('Danger Zone actions are allowed only on devnet');
    });

    it('should throw error with undefined RPC when env var is not devnet', async () => {
      // This test assumes VITE_SOLANA_RPC_DEVNET is not set to a devnet URL
      vi.stubEnv('VITE_SOLANA_RPC_DEVNET', mainnetRpc);
      
      await expect(
        simulatedMint({ amount: 100 })
      ).rejects.toThrow('Danger Zone actions are allowed only on devnet');
      
      vi.unstubAllEnvs();
    });
  });

  describe('simulatedBurn', () => {
    it('should succeed with devnet RPC', async () => {
      const result = await simulatedBurn({ rpcUrl: devnetRpc, amount: 50 });
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('burn');
      expect(result.simulated).toBe(true);
      expect(result.txId).toContain('SIM_BURN_');
    });

    it('should throw error with mainnet RPC', async () => {
      await expect(
        simulatedBurn({ rpcUrl: mainnetRpc, amount: 50 })
      ).rejects.toThrow('Danger Zone actions are allowed only on devnet');
    });
  });

  describe('simulatedFreeze', () => {
    it('should succeed with devnet RPC', async () => {
      const result = await simulatedFreeze({ rpcUrl: devnetRpc, tokenAddress: '11111111111111111111111111111112' });
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('freeze');
      expect(result.simulated).toBe(true);
      expect(result.txId).toContain('SIM_FREEZE_');
    });

    it('should throw error with mainnet RPC', async () => {
      await expect(
        simulatedFreeze({ rpcUrl: mainnetRpc, tokenAddress: '11111111111111111111111111111112' })
      ).rejects.toThrow('Danger Zone actions are allowed only on devnet');
    });
  });

  describe('simulatedThaw', () => {
    it('should succeed with devnet RPC', async () => {
      const result = await simulatedThaw({ rpcUrl: devnetRpc, tokenAddress: '11111111111111111111111111111112' });
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('thaw');
      expect(result.simulated).toBe(true);
      expect(result.txId).toContain('SIM_THAW_');
    });

    it('should throw error with mainnet RPC', async () => {
      await expect(
        simulatedThaw({ rpcUrl: mainnetRpc, tokenAddress: '11111111111111111111111111111112' })
      ).rejects.toThrow('Danger Zone actions are allowed only on devnet');
    });
  });
});

describe('useDangerMode Hook', () => {
  it('should initialize with locked state', () => {
    const { result } = renderHook(() => useDangerMode());
    
    expect(result.current.unlocked).toBe(false);
    expect(result.current.typedValue).toBe('');
  });

  it('should unlock when correct phrase is typed', async () => {
    const { result } = renderHook(() => useDangerMode('UNLOCK DANGER'));
    
    act(() => {
      result.current.setTyped('UNLOCK DANGER');
    });

    await waitFor(() => {
      expect(result.current.unlocked).toBe(true);
    });
  });

  it('should not unlock with incorrect phrase', () => {
    const { result } = renderHook(() => useDangerMode('UNLOCK DANGER'));
    
    act(() => {
      result.current.setTyped('wrong phrase');
    });

    expect(result.current.unlocked).toBe(false);
  });

  it('should unlock via unlock function', async () => {
    const { result } = renderHook(() => useDangerMode('UNLOCK DANGER'));
    
    act(() => {
      result.current.unlock('UNLOCK DANGER');
    });

    await waitFor(() => {
      expect(result.current.unlocked).toBe(true);
    });
  });

  it('should lock when lock function is called', async () => {
    const { result } = renderHook(() => useDangerMode('UNLOCK DANGER'));
    
    // First unlock
    act(() => {
      result.current.unlock('UNLOCK DANGER');
    });

    await waitFor(() => {
      expect(result.current.unlocked).toBe(true);
    });

    // Then lock
    act(() => {
      result.current.lock();
    });

    expect(result.current.unlocked).toBe(false);
    expect(result.current.typedValue).toBe('');
  });

  it('should support custom unlock phrase', async () => {
    const customPhrase = 'CUSTOM UNLOCK';
    const { result } = renderHook(() => useDangerMode(customPhrase));
    
    act(() => {
      result.current.setTyped(customPhrase);
    });

    await waitFor(() => {
      expect(result.current.unlocked).toBe(true);
    });
  });

  it('should track partial typed values', () => {
    const { result } = renderHook(() => useDangerMode('UNLOCK DANGER'));
    
    act(() => {
      result.current.setTyped('UNLOCK');
    });

    expect(result.current.typedValue).toBe('UNLOCK');
    expect(result.current.unlocked).toBe(false);
  });
});
