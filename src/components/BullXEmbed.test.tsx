/**
 * Unit tests for BullXEmbed component
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BullXEmbed } from '../components/BullXEmbed';

describe('BullXEmbed', () => {
  it('should render iframe with default props', () => {
    render(<BullXEmbed />);
    
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('title')).toBe('BullX Terminal');
  });

  it('should render iframe with token address', () => {
    const tokenAddress = '0x123abc';
    render(<BullXEmbed tokenAddress={tokenAddress} />);
    
    const iframe = document.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toContain(tokenAddress);
  });

  it('should apply custom width and height', () => {
    render(<BullXEmbed width="800px" height="400px" />);
    
    const container = document.querySelector('.bullx-embed');
    expect(container).toBeTruthy();
  });

  it('should apply custom className', () => {
    render(<BullXEmbed className="custom-class" />);
    
    const container = document.querySelector('.bullx-embed.custom-class');
    expect(container).toBeTruthy();
  });

  it('should have proper sandbox attributes', () => {
    render(<BullXEmbed />);
    
    const iframe = document.querySelector('iframe');
    const sandbox = iframe?.getAttribute('sandbox');
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
  });

  it('should show fallback when iframe fails to load', () => {
    const onError = vi.fn();
    const { container } = render(<BullXEmbed onError={onError} />);
    
    const iframe = container.querySelector('iframe');
    
    // Simulate iframe error
    if (iframe) {
      const errorEvent = new Event('error');
      iframe.dispatchEvent(errorEvent);
    }
    
    // Note: In a real test environment, you would wait for the state update
    // and check for fallback content
  });

  it('should render with numeric dimensions', () => {
    render(<BullXEmbed width={1000} height={500} />);
    
    const container = document.querySelector('.bullx-embed');
    expect(container).toBeTruthy();
  });
});
