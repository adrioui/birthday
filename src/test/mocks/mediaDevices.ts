import { vi } from 'vitest'

export function mockGetUserMediaSuccess() {
  const stop = vi.fn()
  const track = { stop, kind: 'video' } as unknown as MediaStreamTrack
  const stream = { getTracks: () => [track] } as unknown as MediaStream

  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    configurable: true,
    writable: true,
  })

  return { stream, stop }
}

export function mockGetUserMediaDenied() {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockRejectedValue(
        new Error('Permission denied')
      ),
    },
    configurable: true,
    writable: true,
  })
}

export function mockGetUserMediaUnsupported() {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: undefined,
    configurable: true,
    writable: true,
  })
}
