/**
 * BullX Metadata Client
 * 
 * Fetches token metadata from the BullX API.
 * API URL is configurable via BULLX_API_URL environment variable.
 */

// Default timeout is 10 seconds
const DEFAULT_TIMEOUT_MS = 10000;

export interface BullXTokenMetadata {
  address: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  priceUSD?: number;
  marketCap?: number;
  volume24h?: number;
  holders?: number;
}

export interface BullXClientConfig {
  apiUrl?: string;
  timeout?: number;
}

export class BullXMetadataClient {
  private apiUrl: string;
  private timeout: number;

  constructor(config: BullXClientConfig = {}) {
    // Use environment variable or fallback to default
    this.apiUrl = config.apiUrl || 
                  import.meta.env.VITE_BULLX_API_URL || 
                  'https://api.bullx.io/v1';
    this.timeout = config.timeout || DEFAULT_TIMEOUT_MS;
  }

  /**
   * Fetches metadata for a token by its address
   */
  async getTokenMetadata(address: string): Promise<BullXTokenMetadata | null> {
    if (!address) {
      throw new Error('Token address is required');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(
        `${this.apiUrl}/tokens/${address}`,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`BullX API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as BullXTokenMetadata;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error fetching token metadata');
    }
  }

  /**
   * Gets the configured API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}

// Export a singleton instance for convenience
export const defaultBullXClient = new BullXMetadataClient();
