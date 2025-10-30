/**
 * Vitest setup file
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Extend expect with custom matchers if needed
expect.extend({});
