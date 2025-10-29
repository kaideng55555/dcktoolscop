/**
 * Unit tests for DangerZone component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DangerZone } from '../components/DangerZone';

describe('DangerZone', () => {
  it('should render with default props', () => {
    render(
      <DangerZone>
        <button>Action Button</button>
      </DangerZone>
    );
    
    expect(screen.getByText(/Danger Zone/i)).toBeTruthy();
    expect(screen.getByText(/Action Button/i)).toBeTruthy();
  });

  it('should show custom title and description', () => {
    render(
      <DangerZone 
        title="Custom Zone" 
        description="Custom description"
      >
        <div>Content</div>
      </DangerZone>
    );
    
    expect(screen.getByText(/Custom Zone/i)).toBeTruthy();
    expect(screen.getByText(/Custom description/i)).toBeTruthy();
  });

  it('should render all network options', () => {
    render(
      <DangerZone>
        <div>Content</div>
      </DangerZone>
    );
    
    expect(screen.getByText(/Devnet/i)).toBeTruthy();
    expect(screen.getByText(/Testnet/i)).toBeTruthy();
    expect(screen.getByText(/Mainnet/i)).toBeTruthy();
  });

  it('should default to devnet', () => {
    render(
      <DangerZone>
        <div>Content</div>
      </DangerZone>
    );
    
    expect(screen.getByText(/Devnet \(default\)/i)).toBeTruthy();
  });

  it('should show confirmation checkbox when requireConfirmation is true', () => {
    render(
      <DangerZone requireConfirmation={true}>
        <div>Content</div>
      </DangerZone>
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeTruthy();
    expect(screen.getByText(/Unlock Actions/i)).toBeTruthy();
  });

  it('should not require confirmation when requireConfirmation is false', () => {
    render(
      <DangerZone requireConfirmation={false}>
        <button>Action Button</button>
      </DangerZone>
    );
    
    // Should not show checkbox or unlock button
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it('should enable unlock button when checkbox is checked', () => {
    render(
      <DangerZone requireConfirmation={true}>
        <div>Content</div>
      </DangerZone>
    );
    
    const checkbox = screen.getByRole('checkbox');
    const unlockButton = screen.getByText(/Unlock Actions/i);
    
    // Initially disabled
    expect(unlockButton).toHaveProperty('disabled', true);
    
    // Check the checkbox
    fireEvent.click(checkbox);
    
    // Should be enabled now
    expect(unlockButton).toHaveProperty('disabled', false);
  });

  it('should unlock content when unlock button is clicked', () => {
    render(
      <DangerZone requireConfirmation={true}>
        <div>Content</div>
      </DangerZone>
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    const unlockButton = screen.getByText(/Unlock Actions/i);
    fireEvent.click(unlockButton);
    
    // After unlocking, the locked indicator should not be present
    expect(screen.queryByText('🔒 Locked')).toBeNull();
  });

  it('should call onNetworkChange when network is changed', () => {
    const onNetworkChange = vi.fn();
    
    render(
      <DangerZone onNetworkChange={onNetworkChange}>
        <div>Content</div>
      </DangerZone>
    );
    
    const testnetButton = screen.getByText(/^Testnet$/);
    fireEvent.click(testnetButton);
    
    expect(onNetworkChange).toHaveBeenCalledWith('testnet');
  });

  it('should reset unlock state when network is changed', () => {
    render(
      <DangerZone requireConfirmation={true}>
        <div>Content</div>
      </DangerZone>
    );
    
    // Unlock first
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    const unlockButton = screen.getByText(/Unlock Actions/i);
    fireEvent.click(unlockButton);
    
    // Change network
    const mainnetButton = screen.getByText(/^Mainnet$/);
    fireEvent.click(mainnetButton);
    
    // Should be locked again
    expect(screen.getByText('🔒 Locked')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <DangerZone className="custom-danger">
        <div>Content</div>
      </DangerZone>
    );
    
    expect(container.querySelector('.danger-zone.custom-danger')).toBeTruthy();
  });

  it('should show custom confirm text', () => {
    render(
      <DangerZone 
        requireConfirmation={true}
        confirmText="Custom confirmation text"
      >
        <div>Content</div>
      </DangerZone>
    );
    
    expect(screen.getByText(/Custom confirmation text/i)).toBeTruthy();
  });
});
