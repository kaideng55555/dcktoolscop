import { useEffect, useMemo, useState } from 'react';
import type { BullxMetadata } from '../lib/bullxClient';
import { fetchBullxMetadata } from '../lib/bullxClient';

// Simple in-memory cache for the session
const cache = new Map<string, { meta: BullxMetadata | null; expiresAt: number }>();

export function useBullxMetadata(bullxUrl?: string, opts?: { ttlMs?: number }) {
  const ttlMs = opts?.ttlMs ?? 1000 * 60 * 2; // default 2 minutes
  const key = useMemo(() => (bullxUrl ? `bullx:${bullxUrl}` : undefined), [bullxUrl]);

  const [metadata, setMetadata] = useState<BullxMetadata | null | undefined>(() => {
    if (!key) return undefined;
    const cached = cache.get(key);
    if (!cached) return undefined;
    if (Date.now() > cached.expiresAt) {
      cache.delete(key);
      return undefined;
    }
    return cached.meta;
  });
  const [loading, setLoading] = useState<boolean>(!!bullxUrl && metadata === undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!bullxUrl) {
      setMetadata(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    const cached = cache.get(key!);
    if (cached && Date.now() <= cached.expiresAt) {
      setMetadata(cached.meta);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const meta = await fetchBullxMetadata(bullxUrl);
        if (!mounted) return;
        cache.set(key!, { meta, expiresAt: Date.now() + ttlMs });
        setMetadata(meta ?? null);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [bullxUrl, key, ttlMs]);

  return { metadata, loading, error };
}

export default useBullxMetadata;