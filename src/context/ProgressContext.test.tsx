import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProgressProvider } from './ProgressContext';
import { useProgress } from './useProgress';
import { DEFAULT_MILESTONES } from '../lib/progressConstants';

describe('ProgressContext - Reset Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default milestones all uncompleted', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    expect(result.current.milestones).toEqual(DEFAULT_MILESTONES);
    expect(
      result.current.milestones.every((m: { completed: boolean }) => m.completed === false)
    ).toBe(true);
  });

  it('completes a milestone', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    const completedMilestone = result.current.milestones.find(
      (m: { id: string }) => m.id === 'call-answered'
    );
    expect(completedMilestone?.completed).toBe(true);
  });

  it('completes multiple milestones', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    act(() => result.current.completeMilestone('gift-revealed'));
    act(() => result.current.completeMilestone('photo-snapped'));
    const completedCount = result.current.milestones.filter(
      (m: { completed: boolean }) => m.completed
    ).length;
    expect(completedCount).toBe(3);
  });

  it('resets all milestones to uncompleted', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    act(() => result.current.completeMilestone('gift-revealed'));
    act(() => result.current.completeMilestone('photo-snapped'));
    expect(
      result.current.milestones.filter((m: { completed: boolean }) => m.completed).length
    ).toBe(3);

    act(() => result.current.resetProgress());
    expect(
      result.current.milestones.every((m: { completed: boolean }) => m.completed === false)
    ).toBe(true);
  });

  it('resets to default milestone structure after modification', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    act(() => result.current.completeMilestone('gift-revealed'));

    act(() => result.current.resetProgress());
    expect(result.current.milestones).toEqual(DEFAULT_MILESTONES);
  });

  it('persists milestones to localStorage', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    const stored = JSON.parse(localStorage.getItem('birthday-session-progress')!);
    expect(stored.milestones.find((m: { id: string }) => m.id === 'call-answered').completed).toBe(
      true
    );
  });

  it('loads milestones from localStorage on mount', () => {
    const savedState = {
      milestones: DEFAULT_MILESTONES.map((m: { id: string; name: string; completed: boolean }) => ({
        ...m,
        completed: m.id === 'call-answered',
      })),
    };
    localStorage.setItem('birthday-session-progress', JSON.stringify(savedState));
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    expect(
      result.current.milestones.find((m: { id: string }) => m.id === 'call-answered')?.completed
    ).toBe(true);
    expect(
      result.current.milestones.find((m: { id: string }) => m.id === 'gift-revealed')?.completed
    ).toBe(false);
  });

  it('resets clears localStorage milestones', () => {
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    act(() => result.current.completeMilestone('call-answered'));
    act(() => result.current.completeMilestone('gift-revealed'));

    act(() => result.current.resetProgress());
    const stored = JSON.parse(localStorage.getItem('birthday-session-progress')!);
    expect(stored.milestones.every((m: { completed: boolean }) => m.completed === false)).toBe(
      true
    );
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('birthday-session-progress', 'invalid-json');
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    expect(result.current.milestones).toEqual(DEFAULT_MILESTONES);
  });

  it('handles invalid milestone data in localStorage', () => {
    localStorage.setItem(
      'birthday-session-progress',
      JSON.stringify({ milestones: 'not an array' })
    );
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    expect(result.current.milestones).toEqual(DEFAULT_MILESTONES);
  });

  it('handles milestone with missing fields in localStorage', () => {
    const invalidData = {
      milestones: [
        { id: 'call-answered', name: 'Valid' },
        { id: 'gift-revealed', completed: true },
      ],
    };
    localStorage.setItem('birthday-session-progress', JSON.stringify(invalidData));
    const { result } = renderHook(() => useProgress(), { wrapper: ProgressProvider });
    expect(result.current.milestones).toEqual(DEFAULT_MILESTONES);
  });

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useProgress())).toThrow(
      'useProgress must be used within ProgressProvider'
    );
  });
});
