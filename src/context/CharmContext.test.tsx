import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CharmProvider, useCharms } from './CharmContext';
import { testCharm, testCharm2 } from '../test/fixtures';

describe('CharmContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    expect(result.current.charms).toEqual([]);
    expect(result.current.totalPoints).toBe(0);
  });

  it('adds charm and calculates points', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    expect(result.current.charms).toHaveLength(1);
    expect(result.current.totalPoints).toBe(10);
    expect(result.current.newlyUnlockedCharm).toEqual(testCharm);
  });

  it('prevents duplicate charms by id', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    act(() => result.current.addCharm(testCharm));
    expect(result.current.charms).toHaveLength(1);
  });

  it('accumulates points from multiple charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    act(() => result.current.addCharm(testCharm2));
    expect(result.current.totalPoints).toBe(35); // 10 + 25
  });

  it('removes charm by id', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    act(() => result.current.removeCharm('test-charm-1'));
    expect(result.current.charms).toHaveLength(0);
  });

  it('clears all charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    act(() => result.current.addCharm(testCharm2));
    act(() => result.current.clearCharms());
    expect(result.current.charms).toHaveLength(0);
    expect(result.current.totalPoints).toBe(0);
  });

  it('dismisses unlock modal', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    expect(result.current.newlyUnlockedCharm).toEqual(testCharm);
    act(() => result.current.dismissUnlockModal());
    expect(result.current.newlyUnlockedCharm).toBeNull();
  });

  it('persists charms to localStorage', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    act(() => result.current.addCharm(testCharm));
    const stored = JSON.parse(localStorage.getItem('birthday-os-charms')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('test-charm-1');
  });

  it('loads charms from localStorage on mount', () => {
    localStorage.setItem('birthday-os-charms', JSON.stringify([testCharm]));
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    expect(result.current.charms).toHaveLength(1);
    expect(result.current.totalPoints).toBe(10);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('birthday-os-charms', 'invalid-json');
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
    expect(result.current.charms).toEqual([]);
  });

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useCharms())).toThrow();
  });

  describe('Reset Behavior - Full Journey Reset', () => {
    it('clears charms and resets total points to zero', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addCharm(testCharm));
      act(() => result.current.addCharm(testCharm2));
      expect(result.current.charms).toHaveLength(2);
      expect(result.current.totalPoints).toBe(35);

      act(() => result.current.clearCharms());
      expect(result.current.charms).toHaveLength(0);
      expect(result.current.totalPoints).toBe(0);
    });

    it('clears charms sets localStorage to empty array', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addCharm(testCharm));
      expect(localStorage.getItem('birthday-os-charms')).toBeTruthy();

      act(() => result.current.clearCharms());
      expect(localStorage.getItem('birthday-os-charms')).toBe('[]');
    });

    it('clears charms while bonus points persist (documenting expected behavior)', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addCharm(testCharm));
      act(() => result.current.addBonusPoints(50, 'test-reason'));
      expect(result.current.totalPoints).toBe(60);
      expect(result.current.bonusPoints).toBe(50);

      act(() => result.current.clearCharms());
      expect(result.current.totalPoints).toBe(50);
      expect(result.current.bonusPoints).toBe(50);
    });

    it('accumulates bonus points across sessions', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addBonusPoints(10, 'reason-1'));
      act(() => result.current.addBonusPoints(20, 'reason-2'));
      expect(result.current.bonusPoints).toBe(30);
      expect(result.current.totalPoints).toBe(30);
    });

    it('prevents duplicate bonus points for same reason', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addBonusPoints(10, 'unique-reason'));
      act(() => result.current.addBonusPoints(10, 'unique-reason'));
      expect(result.current.bonusPoints).toBe(10);
    });

    it('persists bonus points to localStorage', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addBonusPoints(25, 'test'));
      const stored = JSON.parse(localStorage.getItem('birthday-os-bonus-points')!);
      expect(stored).toBe(25);
    });

    it('loads bonus points from localStorage on mount', () => {
      localStorage.setItem('birthday-os-bonus-points', JSON.stringify(50));
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      expect(result.current.bonusPoints).toBe(50);
      expect(result.current.totalPoints).toBe(50);
    });

    it('sets and persists redeemed status', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.setRedeemed(true));
      expect(result.current.isRedeemed).toBe(true);
      expect(JSON.parse(localStorage.getItem('birthday-redeemed')!)).toBe(true);
    });

    it('loads redeemed status from localStorage on mount', () => {
      localStorage.setItem('birthday-redeemed', JSON.stringify(true));
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      expect(result.current.isRedeemed).toBe(true);
    });

    it('resets clears charms from localStorage', () => {
      const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider });
      act(() => result.current.addCharm(testCharm));
      act(() => result.current.addCharm(testCharm2));

      act(() => result.current.clearCharms());
      expect(localStorage.getItem('birthday-os-charms')).toBe('[]');
    });
  });
});
