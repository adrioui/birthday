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
  const error = new DOMException('Permission denied', 'NotAllowedError')
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockRejectedValue(error),
    },
    configurable: true,
    writable: true,
  })
}

export function mockGetUserMediaNotFound() {
  const error = new DOMException('Camera not found', 'NotFoundError')
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockRejectedValue(error),
    },
    configurable: true,
    writable: true,
  })
}

export function mockGetUserMediaNotReadable() {
  const error = new DOMException('Camera in use', 'NotReadableError')
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockRejectedValue(error),
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
