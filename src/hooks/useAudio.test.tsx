import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudioState, AudioProvider } from '../context/AudioContext'
import { useAudio } from './useAudio'
import { mockAudioContext } from '../test/mocks/audioContext'
import React from 'react'

function renderWithAudioProvider() {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AudioProvider>{children}</AudioProvider>
  }
  
  return renderHook(
    () => ({ 
      audio: useAudio(), 
      audioState: useAudioState() 
    }), 
    { wrapper: Wrapper }
  )
}

describe('useAudio', () => {
  let mockCtx: ReturnType<typeof mockAudioContext>

  beforeEach(() => {
    mockCtx = mockAudioContext()
  })

  describe('playConnectionSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider()

      act(() => {
        result.current.audioState.toggleMute()
      })

      await act(async () => {
        await result.current.audio.playConnectionSound()
      })

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled()
      expect(mockCtx.createGainMock).not.toHaveBeenCalled()
    })

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error')
      })
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      })

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderWithAudioProvider()

      await act(async () => {
        await result.current.audio.playConnectionSound()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error))

      consoleWarnSpy.mockRestore()
    })
  })

  describe('playGiftRevealSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider()

      act(() => {
        result.current.audioState.toggleMute()
      })

      await act(async () => {
        await result.current.audio.playGiftRevealSound()
      })

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled()
    })

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error')
      })
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      })

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderWithAudioProvider()

      await act(async () => {
        await result.current.audio.playGiftRevealSound()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error))

      consoleWarnSpy.mockRestore()
    })
  })

  describe('playShutterSound', () => {
    it('does nothing when muted', async () => {
      const { result } = renderWithAudioProvider()

      act(() => {
        result.current.audioState.toggleMute()
      })

      await act(async () => {
        await result.current.audio.playShutterSound()
      })

      expect(mockCtx.createOscillatorMock).not.toHaveBeenCalled()
      expect(mockCtx.createBufferSourceMock).not.toHaveBeenCalled()
    })

    it('handles audio errors gracefully', async () => {
      const ErrorAudioContextMock = vi.fn(() => {
        throw new Error('Audio error')
      })
      Object.defineProperty(window, 'AudioContext', {
        value: ErrorAudioContextMock,
        configurable: true,
        writable: true,
      })

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderWithAudioProvider()

      await act(async () => {
        await result.current.audio.playShutterSound()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error))

      consoleWarnSpy.mockRestore()
    })
  })
})
