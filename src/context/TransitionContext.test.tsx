import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TransitionProvider, useTransition } from './TransitionContext'

const mockRect = {
  x: 0, y: 0, width: 100, height: 200,
  top: 0, right: 100, bottom: 200, left: 0,
  toJSON: () => ({})
} as DOMRect

describe('TransitionContext', () => {
  it('initializes with no transition', () => {
    const { result } = renderHook(() => useTransition(), { wrapper: TransitionProvider })
    expect(result.current.isTransitioning).toBe(false)
    expect(result.current.transitionType).toBeNull()
    expect(result.current.phoneScreenRect).toBeNull()
  })

  it('starts phone-to-sms transition', () => {
    const { result } = renderHook(() => useTransition(), { wrapper: TransitionProvider })
    act(() => result.current.startTransition('phone-to-sms', mockRect))
    expect(result.current.isTransitioning).toBe(true)
    expect(result.current.transitionType).toBe('phone-to-sms')
    expect(result.current.phoneScreenRect).toBe(mockRect)
  })

  it('starts gift-to-camcorder transition', () => {
    const { result } = renderHook(() => useTransition(), { wrapper: TransitionProvider })
    act(() => result.current.startTransition('gift-to-camcorder', mockRect))
    expect(result.current.transitionType).toBe('gift-to-camcorder')
  })

  it('ends transition and resets state', () => {
    const { result } = renderHook(() => useTransition(), { wrapper: TransitionProvider })
    act(() => result.current.startTransition('phone-to-sms', mockRect))
    act(() => result.current.endTransition())
    expect(result.current.isTransitioning).toBe(false)
    expect(result.current.transitionType).toBeNull()
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useTransition())).toThrow()
  })
})
