import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CharmProvider, useCharms } from './CharmContext'
import { testCharm, testCharm2 } from '../test/fixtures'

describe('CharmContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    expect(result.current.charms).toEqual([])
    expect(result.current.totalPoints).toBe(0)
  })

  it('adds charm and calculates points', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    expect(result.current.charms).toHaveLength(1)
    expect(result.current.totalPoints).toBe(10)
    expect(result.current.newlyUnlockedCharm).toEqual(testCharm)
  })

  it('prevents duplicate charms by id', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    act(() => result.current.addCharm(testCharm))
    expect(result.current.charms).toHaveLength(1)
  })

  it('accumulates points from multiple charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    act(() => result.current.addCharm(testCharm2))
    expect(result.current.totalPoints).toBe(35) // 10 + 25
  })

  it('removes charm by id', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    act(() => result.current.removeCharm('test-charm-1'))
    expect(result.current.charms).toHaveLength(0)
  })

  it('clears all charms', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    act(() => result.current.addCharm(testCharm2))
    act(() => result.current.clearCharms())
    expect(result.current.charms).toHaveLength(0)
    expect(result.current.totalPoints).toBe(0)
  })

  it('dismisses unlock modal', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    expect(result.current.newlyUnlockedCharm).toEqual(testCharm)
    act(() => result.current.dismissUnlockModal())
    expect(result.current.newlyUnlockedCharm).toBeNull()
  })

  it('persists charms to localStorage', () => {
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    act(() => result.current.addCharm(testCharm))
    const stored = JSON.parse(localStorage.getItem('birthday-os-charms')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('test-charm-1')
  })

  it('loads charms from localStorage on mount', () => {
    localStorage.setItem('birthday-os-charms', JSON.stringify([testCharm]))
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    expect(result.current.charms).toHaveLength(1)
    expect(result.current.totalPoints).toBe(10)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('birthday-os-charms', 'invalid-json')
    const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
    expect(result.current.charms).toEqual([])
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useCharms())).toThrow()
  })
})
