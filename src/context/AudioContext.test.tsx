import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AudioProvider, useAudioState } from './AudioContext';

describe('AudioContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with unmuted state', () => {
    const { result } = renderHook(() => useAudioState(), { wrapper: AudioProvider });
    expect(result.current.isMuted).toBe(false);
  });

  it('toggleMute changes isMuted state', () => {
    const { result } = renderHook(() => useAudioState(), { wrapper: AudioProvider });
    expect(result.current.isMuted).toBe(false);

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(true);

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(false);
  });

  it('persists mute state to localStorage', () => {
    const { result } = renderHook(() => useAudioState(), { wrapper: AudioProvider });
    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(true);

    const stored = localStorage.getItem('birthday-os-audio-muted');
    expect(stored).toBe('true');
  });

  it('loads mute state from localStorage on mount', () => {
    localStorage.setItem('birthday-os-audio-muted', 'true');
    const { result } = renderHook(() => useAudioState(), { wrapper: AudioProvider });
    expect(result.current.isMuted).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('birthday-os-audio-muted', 'invalid-json');
    const { result } = renderHook(() => useAudioState(), { wrapper: AudioProvider });
    expect(result.current.isMuted).toBe(false);
  });

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useAudioState())).toThrow();
  });
});
