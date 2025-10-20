// Lightweight BullX metadata client
// - Attempts to parse a BullX URL to extract an identifier
// - Calls configured BULLX_API_URL endpoints if available
// - Uses AbortController timeout and returns typed metadata or null on failure

export type BullxMetadata = {
  id: string;
  title?: string;
  symbol?: string;
  description?: string;
  logoUrl?: string;
  lastPrice?: string;      // e.g. "0.0012 SOL"
  volume24h?: string;      // e.g. "42k"
  liquidity?: string;      // e.g. "8k"
  tokenMint?: string;      // if applicable
  sourceUrl?: string;      // original BullX URL
  fetchedAt: string;
};

const DEFAULT_TIMEOUT = 4000; // ms

function parseBullxUrl(url: string): { type: 'token' | 'unknown'; id?: string } {
  try {
    const u = new URL(url, 'https://example.invalid');
    // Typical patterns to support (adjust if BullX uses different routes):
    // - https://bullx.io/token/<id>
    // - https://bullx.app/token/<id>
    // - https://bullx/<id> etc.
    const path = u.pathname.replace(/^\/+/g, '').replace(/\/+$/g, ''); // trim slashes
    const parts = path.split('/');
    if (parts.length >= 2 && parts[0].toLowerCase().includes('token')) {
      return { type: 'token', id: parts[1] };
    }
    // sometimes the id is first path segment
    if (parts.length >= 1 && /^[A-Za-z0-9_-]{8,}$/.test(parts[0])) {
      return { type: 'token', id: parts[0] };
    }
  } catch (e) {
    // ignore parse errors
  }
  return { type: 'unknown' };
}

async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(id);
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * fetchBullxMetadata
 * - bullxUrl: bullx page URL (string)
 * - opts.apiBase?: string (optional override, default from env BULLX_API_URL)
 *
 * Returns BullxMetadata or null if no API or fetch fails.
 */
export async function fetchBullxMetadata(bullxUrl: string, opts?: { apiBase?: string; timeoutMs?: number }): Promise<BullxMetadata | null> {
  const apiBase = opts?.apiBase ?? (process.env?.BULLX_API_URL as string) ?? '';
  if (!apiBase) return null;

  const parsed = parseBullxUrl(bullxUrl);
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT;

  const candidateEndpoints: string[] = [];
  if (parsed.type === 'token' && parsed.id) {
    candidateEndpoints.push(`${apiBase.replace(/\/\$/, '')}/token/${encodeURIComponent(parsed.id)}`);
    candidateEndpoints.push(`${apiBase.replace(/\/\$/, '')}/metadata/${encodeURIComponent(parsed.id)}`);
  }
  // Generic query endpoint that some APIs may expose
  candidateEndpoints.push(`${apiBase.replace(/\/\$/, '')}/metadata?url=${encodeURIComponent(bullxUrl)}`);

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetchWithTimeout(endpoint, { method: 'GET', headers: { Accept: 'application/json' } }, timeoutMs);
      if (!res.ok) continue;
      const json = await res.json();
      // The API shape may vary; normalize into BullxMetadata
      const meta: Partial<BullxMetadata> =
        json?.data ??
        json?.metadata ??
        json; // tolerate variants

      const normalized: BullxMetadata = {
        id: meta.id ?? parsed.id ?? meta.tokenMint ?? `${Date.now()}`,
        title: meta.title ?? meta.name ?? meta.symbol ?? undefined,
        symbol: meta.symbol ?? undefined,
        description: meta.description ?? undefined,
        logoUrl: meta.logoUrl ?? meta.logo ?? meta.image ?? undefined,
        lastPrice: meta.lastPrice ?? meta.price ?? undefined,
        volume24h: meta.volume24h ?? meta['24h_volume'] ?? meta.volume ?? undefined,
        liquidity: meta.liquidity ?? undefined,
        tokenMint: meta.tokenMint ?? meta.mint ?? undefined,
        sourceUrl: bullxUrl,
        fetchedAt: new Date().toISOString()
      };

      return normalized;
    } catch (err) {
      // try next endpoint
      continue;
    }
  }

  return null;
}