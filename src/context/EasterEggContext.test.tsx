import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { EasterEggContext, EasterEggProvider, type EasterEggId } from './EasterEggContext';

function useEasterEggState() {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error('useEasterEggState must be used within EasterEggProvider');
  return ctx;
}

describe('EasterEggContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no discovered eggs', () => {
    const { result } = renderHook(() => useEasterEggState(), { wrapper: EasterEggProvider });

    expect(result.current.discoveredEggs.size).toBe(0);
    expect(result.current.showOverlay).toBe(false);
    expect(result.current.currentEgg).toBeNull();

    expect(result.current.isDiscovered('brand-logo')).toBe(false);
  });

  it('triggerEgg adds to discovered set and isDiscovered reflects it', () => {
    const eggId: EasterEggId = 'brand-logo';

    const { result } = renderHook(() => useEasterEggState(), { wrapper: EasterEggProvider });

    act(() => result.current.triggerEgg(eggId));

    expect(result.current.discoveredEggs.has(eggId)).toBe(true);
    expect(result.current.isDiscovered(eggId)).toBe(true);

    expect(result.current.showOverlay).toBe(true);
    expect(result.current.currentEgg?.id).toBe(eggId);
  });

  it('isDiscovered returns correct values across multiple eggs', () => {
    const { result } = renderHook(() => useEasterEggState(), { wrapper: EasterEggProvider });

    act(() => result.current.triggerEgg('brand-logo'));

    expect(result.current.isDiscovered('brand-logo')).toBe(true);
    expect(result.current.isDiscovered('heart-charm')).toBe(false);

    act(() => result.current.triggerEgg('heart-charm'));

    expect(result.current.isDiscovered('brand-logo')).toBe(true);
    expect(result.current.isDiscovered('heart-charm')).toBe(true);
    expect(result.current.discoveredEggs.size).toBe(2);
  });

  it('persists discovered eggs to localStorage', () => {
    const { result } = renderHook(() => useEasterEggState(), { wrapper: EasterEggProvider });

    const eggId: EasterEggId = 'brand-logo';

    act(() => result.current.triggerEgg(eggId));

    const stored = localStorage.getItem('birthday-os-easter-eggs');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toContain(eggId);
  });

  it('restores discovered eggs from localStorage on mount', () => {
    const eggId: EasterEggId = 'heart-charm';
    localStorage.setItem('birthday-os-easter-eggs', JSON.stringify([eggId]));

    const { result } = renderHook(() => useEasterEggState(), { wrapper: EasterEggProvider });

    expect(result.current.isDiscovered(eggId)).toBe(true);
    expect(result.current.discoveredEggs.size).toBe(1);
  });
});
