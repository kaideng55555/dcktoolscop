/**
 * Unit tests for useBullXMetadata hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBullXMetadata } from '../hooks/useBullXMetadata';
import { BullXMetadataClient } from '../lib/bullx-client';

describe('useBullXMetadata', () => {
  let mockClient: BullXMetadataClient;

  beforeEach(() => {
    mockClient = new BullXMetadataClient({ apiUrl: 'https://api.test.com' });
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => 
      useBullXMetadata('0x123', { client: mockClient })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch metadata successfully', async () => {
    const mockMetadata = {
      address: '0x123',
      name: 'Test Token',
      symbol: 'TEST',
    };

    vi.spyOn(mockClient, 'getTokenMetadata').mockResolvedValue(mockMetadata);

    const { result } = renderHook(() => 
      useBullXMetadata('0x123', { client: mockClient })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockMetadata);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const error = new Error('API Error');
    vi.spyOn(mockClient, 'getTokenMetadata').mockRejectedValue(error);

    const { result } = renderHook(() => 
      useBullXMetadata('0x456', { client: mockClient })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(error);
  });

  it('should not fetch when address is null', () => {
    const spy = vi.spyOn(mockClient, 'getTokenMetadata');

    const { result } = renderHook(() => 
      useBullXMetadata(null, { client: mockClient })
    );

    expect(result.current.loading).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not fetch when enabled is false', () => {
    const spy = vi.spyOn(mockClient, 'getTokenMetadata');

    const { result } = renderHook(() => 
      useBullXMetadata('0x123', { client: mockClient, enabled: false })
    );

    expect(result.current.loading).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should refetch data when refetch is called', async () => {
    const mockMetadata = {
      address: '0x123',
      name: 'Test Token',
      symbol: 'TEST',
    };

    const spy = vi.spyOn(mockClient, 'getTokenMetadata').mockResolvedValue(mockMetadata);

    const { result } = renderHook(() => 
      useBullXMetadata('0x123', { client: mockClient })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Clear the spy to count new calls
    spy.mockClear();

    await result.current.refetch();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should use cache on subsequent renders', async () => {
    const mockMetadata = {
      address: '0x789',
      name: 'Test Token',
      symbol: 'TEST',
    };

    const spy = vi.spyOn(mockClient, 'getTokenMetadata').mockResolvedValue(mockMetadata);

    // First render
    const { result: result1, unmount: unmount1 } = renderHook(() => 
      useBullXMetadata('0x789', { client: mockClient })
    );

    await waitFor(() => expect(result1.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(1);
    
    unmount1();

    // Second render with same address should use cache
    const { result: result2 } = renderHook(() => 
      useBullXMetadata('0x789', { client: mockClient })
    );

    await waitFor(() => expect(result2.current.loading).toBe(false));

    // Should still be 1 call because of cache
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result2.current.data).toEqual(mockMetadata);
  });
});
