import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCamera } from './useCamera'
import {
  mockGetUserMediaSuccess,
  mockGetUserMediaDenied,
  mockGetUserMediaUnsupported,
} from '../test/mocks/mediaDevices'

describe('useCamera', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('starts in idle state', () => {
    mockGetUserMediaSuccess()
    const { result } = renderHook(() => useCamera())
    expect(result.current.state).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  it('transitions to active on successful camera start', async () => {
    mockGetUserMediaSuccess()
    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    expect(result.current.state).toBe('active')
    expect(result.current.error).toBeNull()
  })

  it('transitions to denied when permission refused', async () => {
    mockGetUserMediaDenied()
    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    expect(result.current.state).toBe('denied')
    expect(result.current.error).toBe('Camera permission denied')
  })

  it('handles unsupported browser', async () => {
    mockGetUserMediaUnsupported()
    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    expect(result.current.state).toBe('error')
  })

  it('stops camera and returns to idle', async () => {
    const { stop } = mockGetUserMediaSuccess()
    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    act(() => result.current.stopCamera())

    expect(result.current.state).toBe('idle')
    expect(stop).toHaveBeenCalled()
  })

  it('cleans up stream on unmount', async () => {
    const { stop } = mockGetUserMediaSuccess()
    const { result, unmount } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    unmount()
    expect(stop).toHaveBeenCalled()
  })
})
