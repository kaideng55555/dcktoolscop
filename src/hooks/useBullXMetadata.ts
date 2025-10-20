/**
 * React hook for BullX metadata with TTL caching
 */

import { useState, useEffect, useCallback } from 'react';
import { BullXMetadataClient, BullXTokenMetadata, defaultBullXClient } from '../lib/bullx-client';
import { TTLCache } from '../lib/ttl-cache';

// Default cache TTL is 5 minutes
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

// Global cache instance shared across all hook instances
const metadataCache = new TTLCache<BullXTokenMetadata>(DEFAULT_CACHE_TTL_MS);

export interface UseBullXMetadataOptions {
  client?: BullXMetadataClient;
  cacheTTL?: number;
  enabled?: boolean;
}

export interface UseBullXMetadataResult {
  data: BullXTokenMetadata | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching BullX token metadata with caching
 * 
 * @param address - Token address to fetch metadata for
 * @param options - Configuration options
 * @returns Metadata, loading state, error, and refetch function
 */
export function useBullXMetadata(
  address: string | null | undefined,
  options: UseBullXMetadataOptions = {}
): UseBullXMetadataResult {
  const {
    client = defaultBullXClient,
    cacheTTL = DEFAULT_CACHE_TTL_MS,
    enabled = true
  } = options;

  const [data, setData] = useState<BullXTokenMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetadata = useCallback(async (force = false) => {
    if (!address || !enabled) {
      return;
    }

    // Check cache first unless forced
    if (!force) {
      const cached = metadataCache.get(address);
      if (cached) {
        setData(cached);
        setLoading(false);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const metadata = await client.getTokenMetadata(address);
      
      if (metadata) {
        metadataCache.set(address, metadata, cacheTTL);
        setData(metadata);
      } else {
        setData(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch metadata');
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [address, client, cacheTTL, enabled]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const refetch = useCallback(async () => {
    await fetchMetadata(true);
  }, [fetchMetadata]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
