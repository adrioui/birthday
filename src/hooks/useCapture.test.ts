import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCapture } from './useCapture'

describe('useCapture', () => {
  let mockContext: CanvasRenderingContext2D
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    mockContext = {
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    originalCreateElement = document.createElement.bind(document)
    
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const canvas = originalCreateElement('canvas') as HTMLCanvasElement
        vi.spyOn(canvas, 'getContext').mockReturnValue(mockContext as unknown as CanvasRenderingContext2D)
        vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,test')
        return canvas
      }
      return originalCreateElement(tagName)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with no capture', () => {
    const { result } = renderHook(() => useCapture())
    expect(result.current.isCapturing).toBe(false)
    expect(result.current.lastCapture).toBeNull()
  })

  it('captures frame from video', () => {
    const mockVideo = {
      videoWidth: 1280,
      videoHeight: 720,
    } as HTMLVideoElement

    const { result } = renderHook(() => useCapture())

    let captureResult: { dataUrl: string; timestamp: number } | null = null
    act(() => {
      captureResult = result.current.captureFrame(mockVideo)
    })

    expect(captureResult).not.toBeNull()
    expect(captureResult!.dataUrl).toBe('data:image/png;base64,test')
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockVideo, 0, 0, 1280, 720)
  })

  it('returns null for null video', () => {
    const { result } = renderHook(() => useCapture())

    let captureResult: unknown = 'not-null'
    act(() => {
      captureResult = result.current.captureFrame(null as unknown as HTMLVideoElement)
    })

    expect(captureResult).toBeNull()
  })

  it('uses fallback dimensions when video has no size', () => {
    const mockVideo = {
      videoWidth: 0,
      videoHeight: 0,
    } as HTMLVideoElement

    const { result } = renderHook(() => useCapture())

    act(() => {
      result.current.captureFrame(mockVideo)
    })

    expect(mockContext.drawImage).toHaveBeenCalledWith(mockVideo, 0, 0, 640, 480)
  })

  it('clears capture', () => {
    const mockVideo = { videoWidth: 100, videoHeight: 100 } as HTMLVideoElement
    const { result } = renderHook(() => useCapture())

    act(() => {
      result.current.captureFrame(mockVideo)
    })
    expect(result.current.lastCapture).not.toBeNull()

    act(() => {
      result.current.clearCapture()
    })
    expect(result.current.lastCapture).toBeNull()
  })
})
