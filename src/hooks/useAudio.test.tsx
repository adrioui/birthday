import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioState, AudioProvider } from '../context/AudioContext';
import { useAudio } from './useAudio';
import { mockAudioContext } from '../test/mocks/audioContext';
import React from 'react';

function renderWithAudioProvider() {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AudioProvider>{children}</AudioProvider>;
  }

  return renderHook(
    () => ({
      audio: useAudio(),
      audioState: useAudioState(),
    }),
    { wrapper: Wrapper }
  );
}

describe('useAudio', () => {
  let mockCtx: ReturnType<typeof mockAudioContext>;

  beforeEach(() => {
    mockCtx = mockAudioContext();
  });

  describe('playConnectionSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider();

      act(() => {
        result.current.audioState.toggleMute();
      });

      await act(async () => {
        await result.current.audio.playConnectionSound();
      });

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled();
      expect(mockCtx.createGainMock).not.toHaveBeenCalled();
    });

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error');
      });
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderWithAudioProvider();

      await act(async () => {
        await result.current.audio.playConnectionSound();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error));

      consoleWarnSpy.mockRestore();
    });
  });

  describe('playGiftRevealSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider();

      act(() => {
        result.current.audioState.toggleMute();
      });

      await act(async () => {
        await result.current.audio.playGiftRevealSound();
      });

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled();
    });

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error');
      });
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderWithAudioProvider();

      await act(async () => {
        await result.current.audio.playGiftRevealSound();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error));

      consoleWarnSpy.mockRestore();
    });
  });

  describe('playShutterSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider();

      act(() => {
        result.current.audioState.toggleMute();
      });

      await act(async () => {
        await result.current.audio.playShutterSound();
      });

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled();
      expect(mockCtx.createBufferSourceMock).not.toHaveBeenCalled();
    });

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error');
      });
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderWithAudioProvider();

      await act(async () => {
        await result.current.audio.playShutterSound();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error));

      consoleWarnSpy.mockRestore();
    });
  });

  describe('AudioContext storage safeguards', () => {
    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('birthday-os-audio-muted', 'invalid-json');
      const { result } = renderWithAudioProvider();
      expect(result.current.audioState.isMuted).toBe(false);
    });

    it('handles localStorage read errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage read error');
      });
      const { result } = renderWithAudioProvider();
      expect(result.current.audioState.isMuted).toBe(false);
    });

    it('handles localStorage write errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderWithAudioProvider();
      act(() => {
        result.current.audioState.toggleMute();
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to persist audio state:',
        expect.any(DOMException)
      );
      consoleErrorSpy.mockRestore();
    });

    it('persists mute state to localStorage', () => {
      const { result } = renderWithAudioProvider();
      act(() => {
        result.current.audioState.toggleMute();
      });
      expect(localStorage.getItem('birthday-os-audio-muted')).toBe('true');
    });

    it('loads mute state from localStorage', () => {
      localStorage.setItem('birthday-os-audio-muted', 'true');
      const { result } = renderWithAudioProvider();
      expect(result.current.audioState.isMuted).toBe(true);
    });

    it('handles invalid mute state values gracefully', () => {
      localStorage.setItem('birthday-os-audio-muted', 'not-a-boolean');
      const { result } = renderWithAudioProvider();
      expect(result.current.audioState.isMuted).toBe(false);
    });

    it('handles null mute state gracefully', () => {
      localStorage.setItem('birthday-os-audio-muted', 'null');
      const { result } = renderWithAudioProvider();
      expect(result.current.audioState.isMuted).toBe(null);
    });
  });

  describe('rapid toggle safeguards', () => {
    it('does not desync state with rapid toggles', () => {
      const { result } = renderWithAudioProvider();
      act(() => {
        result.current.audioState.toggleMute();
        result.current.audioState.toggleMute();
        result.current.audioState.toggleMute();
      });
      expect(result.current.audioState.isMuted).toBe(true);
      expect(localStorage.getItem('birthday-os-audio-muted')).toBe('true');
    });

    it('maintains correct state after many toggles', () => {
      const { result } = renderWithAudioProvider();
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.audioState.toggleMute();
        }
      });
      expect(result.current.audioState.isMuted).toBe(false);
      expect(localStorage.getItem('birthday-os-audio-muted')).toBe('false');
    });
  });
});
