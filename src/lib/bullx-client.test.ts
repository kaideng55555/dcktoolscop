/**
 * Unit tests for BullX Metadata Client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BullXMetadataClient } from '../lib/bullx-client';

describe('BullXMetadataClient', () => {
  let client: BullXMetadataClient;

  beforeEach(() => {
    client = new BullXMetadataClient({ apiUrl: 'https://api.test.com' });
    vi.restoreAllMocks();
  });

  it('should initialize with default config', () => {
    const defaultClient = new BullXMetadataClient();
    expect(defaultClient.getApiUrl()).toBeDefined();
  });

  it('should initialize with custom config', () => {
    const customClient = new BullXMetadataClient({ 
      apiUrl: 'https://custom.api.com',
      timeout: 5000 
    });
    expect(customClient.getApiUrl()).toBe('https://custom.api.com');
  });

  it('should throw error for empty address', async () => {
    await expect(client.getTokenMetadata('')).rejects.toThrow('Token address is required');
  });

  it('should fetch token metadata successfully', async () => {
    const mockMetadata = {
      address: '0x123',
      name: 'Test Token',
      symbol: 'TEST',
      decimals: 18,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockMetadata,
    });

    const result = await client.getTokenMetadata('0x123');
    expect(result).toEqual(mockMetadata);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.com/tokens/0x123',
      expect.any(Object)
    );
  });

  it('should return null for 404 responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await client.getTokenMetadata('0x123');
    expect(result).toBeNull();
  });

  it('should throw error for non-404 error responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(client.getTokenMetadata('0x123')).rejects.toThrow('BullX API error: 500');
  });

  it('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(client.getTokenMetadata('0x123')).rejects.toThrow('Network error');
  });

  it('should handle timeout', async () => {
    // Note: Testing actual timeout with fetch abort is complex in a test environment
    // This test verifies the timeout configuration is accepted
    const shortTimeoutClient = new BullXMetadataClient({ 
      apiUrl: 'https://api.test.com',
      timeout: 100 
    });

    const abortError = new Error('The operation was aborted.');
    abortError.name = 'AbortError';
    
    global.fetch = vi.fn().mockRejectedValue(abortError);

    await expect(shortTimeoutClient.getTokenMetadata('0x123')).rejects.toThrow('timeout');
  });

  it('should include correct headers', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await client.getTokenMetadata('0x123');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });
});
