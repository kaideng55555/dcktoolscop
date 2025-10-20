/**
 * Unit tests for TTL Cache
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TTLCache } from '../lib/ttl-cache';

describe('TTLCache', () => {
  let cache: TTLCache<string>;

  beforeEach(() => {
    cache = new TTLCache<string>(1000); // 1 second TTL
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return undefined for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('should expire values after TTL', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // Advance time past TTL
    vi.advanceTimersByTime(1100);

    expect(cache.get('key1')).toBeUndefined();
  });

  it('should support custom TTL per entry', () => {
    cache.set('key1', 'value1', 500);
    cache.set('key2', 'value2', 2000);

    // After 600ms, key1 should be expired but key2 should not
    vi.advanceTimersByTime(600);

    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('value2');
  });

  it('should check if key exists', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
  });

  it('should delete keys', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);

    cache.delete('key1');
    expect(cache.has('key1')).toBe(false);
  });

  it('should clear all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it('should prune expired entries', () => {
    cache.set('key1', 'value1', 500);
    cache.set('key2', 'value2', 2000);
    expect(cache.size()).toBe(2);

    // Advance time to expire key1
    vi.advanceTimersByTime(600);

    cache.prune();
    expect(cache.size()).toBe(1);
    expect(cache.has('key2')).toBe(true);
  });

  it('should handle overwriting values', () => {
    cache.set('key1', 'value1');
    cache.set('key1', 'value2');
    expect(cache.get('key1')).toBe('value2');
  });
});
