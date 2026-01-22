import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCharmFlip } from './useCharmFlip'

describe('useCharmFlip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with no flipped charm', () => {
    const { result } = renderHook(() => useCharmFlip())
    expect(result.current.flippedCharmId).toBeNull()
  })

  it('flips a charm', () => {
    const { result } = renderHook(() => useCharmFlip())
    act(() => result.current.handleFlip('charm-1'))
    expect(result.current.flippedCharmId).toBe('charm-1')
    expect(result.current.isFlipped('charm-1')).toBe(true)
  })

  it('closes flipped charm', () => {
    const { result } = renderHook(() => useCharmFlip())
    act(() => result.current.handleFlip('charm-1'))
    act(() => result.current.closeFlipped())
    expect(result.current.flippedCharmId).toBeNull()
  })

  it('queues flip when switching during animation', () => {
    const { result } = renderHook(() => useCharmFlip())
    
    // Flip first charm
    act(() => result.current.handleFlip('charm-1'))
    expect(result.current.flippedCharmId).toBe('charm-1')
    
    // Try to flip second charm immediately
    act(() => result.current.handleFlip('charm-2'))
    
    // First closes, wait for animation delay
    act(() => vi.advanceTimersByTime(600))
    
    // Now second should be flipped
    expect(result.current.flippedCharmId).toBe('charm-2')
  })

  it('isFlipped returns false for non-flipped charm', () => {
    const { result } = renderHook(() => useCharmFlip())
    act(() => result.current.handleFlip('charm-1'))
    expect(result.current.isFlipped('charm-2')).toBe(false)
  })
})
