import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProgressProvider } from '../context/ProgressContext';
import { useProgress } from '../context/useProgress';
import { CharmProvider, useCharms } from '../context/CharmContext';
import { AudioProvider, useAudioState } from '../context/AudioContext';
import { testCharm, testCharm2 } from '../test/fixtures';
import { DEFAULT_MILESTONES } from '../lib/progressConstants';

describe('FR-029: Full Journey Reset - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderWithAllProviders() {
    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <ProgressProvider>
          <CharmProvider>
            <AudioProvider>{children}</AudioProvider>
          </CharmProvider>
        </ProgressProvider>
      );
    }
    return renderHook(
      () => ({
        progress: useProgress(),
        charms: useCharms(),
        audio: useAudioState(),
      }),
      { wrapper: Wrapper }
    );
  }

  describe('Happy Path - Reset Session State', () => {
    it('resets all session state (progress, charms) while preserving settings (audio)', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.progress.completeMilestone('call-answered');
        result.current.progress.completeMilestone('gift-revealed');
        result.current.progress.completeMilestone('photo-snapped');
      });

      act(() => {
        result.current.charms.addCharm(testCharm);
        result.current.charms.addCharm(testCharm2);
        result.current.charms.addBonusPoints(50, 'journey-completion');
        result.current.charms.setRedeemed(true);
      });

      act(() => {
        result.current.audio.toggleMute();
      });

      expect(
        result.current.progress.milestones.filter((m: { completed: boolean }) => m.completed).length
      ).toBe(3);
      expect(result.current.charms.charms).toHaveLength(2);
      expect(result.current.charms.totalPoints).toBe(85);
      expect(result.current.charms.bonusPoints).toBe(50);
      expect(result.current.charms.isRedeemed).toBe(true);
      expect(result.current.audio.isMuted).toBe(true);

      act(() => {
        result.current.progress.resetProgress();
        result.current.charms.clearCharms();
      });

      expect(
        result.current.progress.milestones.every(
          (m: { completed: boolean }) => m.completed === false
        )
      ).toBe(true);
      expect(result.current.progress.milestones).toEqual(DEFAULT_MILESTONES);
      expect(result.current.charms.charms).toHaveLength(0);
      expect(result.current.charms.totalPoints).toBe(50);
      expect(result.current.charms.isRedeemed).toBe(true);
      expect(result.current.audio.isMuted).toBe(true);
    });

    it('clears all localStorage session data after reset', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.progress.completeMilestone('call-answered');
        result.current.charms.addCharm(testCharm);
        result.current.charms.addBonusPoints(25, 'test');
        result.current.charms.setRedeemed(true);
      });

      expect(localStorage.getItem('birthday-session-progress')).toBeTruthy();
      expect(localStorage.getItem('birthday-os-charms')).toBeTruthy();
      expect(localStorage.getItem('birthday-os-bonus-points')).toBeTruthy();
      expect(localStorage.getItem('birthday-redeemed')).toBeTruthy();

      act(() => {
        result.current.progress.resetProgress();
        result.current.charms.clearCharms();
      });

      const progressData = JSON.parse(localStorage.getItem('birthday-session-progress')!);
      expect(
        progressData.milestones.every((m: { completed: boolean }) => m.completed === false)
      ).toBe(true);
      expect(localStorage.getItem('birthday-os-charms')).toBe('[]');
    });

    it('preserves audio mute setting across reset', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.audio.toggleMute();
      });

      expect(result.current.audio.isMuted).toBe(true);
      expect(JSON.parse(localStorage.getItem('birthday-os-audio-muted')!)).toBe(true);

      act(() => {
        result.current.progress.resetProgress();
        result.current.charms.clearCharms();
      });

      expect(result.current.audio.isMuted).toBe(true);
      expect(JSON.parse(localStorage.getItem('birthday-os-audio-muted')!)).toBe(true);
    });
  });

  describe('Reset Scenarios', () => {
    it('resets after completing all milestones', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.progress.completeMilestone('call-answered');
        result.current.progress.completeMilestone('gift-revealed');
        result.current.progress.completeMilestone('photo-snapped');
        result.current.progress.completeMilestone('charm-collected');
        result.current.progress.completeMilestone('cd-burned');
        result.current.progress.completeMilestone('game-played');
      });

      expect(
        result.current.progress.milestones.filter((m: { completed: boolean }) => m.completed).length
      ).toBe(6);

      act(() => {
        result.current.progress.resetProgress();
      });

      expect(
        result.current.progress.milestones.every(
          (m: { completed: boolean }) => m.completed === false
        )
      ).toBe(true);
    });

    it('resets with empty charm collection', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.progress.completeMilestone('call-answered');
      });

      expect(result.current.charms.charms).toHaveLength(0);

      act(() => {
        result.current.progress.resetProgress();
        result.current.charms.clearCharms();
      });

      expect(
        result.current.progress.milestones.every(
          (m: { completed: boolean }) => m.completed === false
        )
      ).toBe(true);
      expect(result.current.charms.charms).toHaveLength(0);
    });

    it('resets with maximum charm collection', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.charms.addCharm(testCharm);
        result.current.charms.addCharm(testCharm2);
        result.current.charms.addBonusPoints(100, 'max-points');
        result.current.charms.setRedeemed(true);
      });

      expect(result.current.charms.totalPoints).toBe(135);
      expect(result.current.charms.isRedeemed).toBe(true);

      act(() => {
        result.current.progress.resetProgress();
        result.current.charms.clearCharms();
      });

      expect(
        result.current.progress.milestones.every(
          (m: { completed: boolean }) => m.completed === false
        )
      ).toBe(true);
      expect(result.current.charms.charms).toHaveLength(0);
      expect(result.current.charms.totalPoints).toBe(100);
      expect(result.current.charms.isRedeemed).toBe(true);
    });
  });

  describe('Storage Cleanup', () => {
    it('removes charms from localStorage on clear', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.charms.addCharm(testCharm);
        result.current.charms.addCharm(testCharm2);
      });

      expect(localStorage.getItem('birthday-os-charms')).toBeTruthy();

      act(() => {
        result.current.charms.clearCharms();
      });

      expect(localStorage.getItem('birthday-os-charms')).toBe('[]');
    });

    it('resets milestone data in localStorage to defaults', () => {
      const { result } = renderWithAllProviders();

      act(() => {
        result.current.progress.completeMilestone('call-answered');
        result.current.progress.completeMilestone('gift-revealed');
      });

      act(() => {
        result.current.progress.resetProgress();
      });

      const stored = JSON.parse(localStorage.getItem('birthday-session-progress')!);
      expect(stored.milestones).toEqual(DEFAULT_MILESTONES);
    });
  });
});
