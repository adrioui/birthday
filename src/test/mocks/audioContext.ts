import { vi } from 'vitest'

export function mockAudioContext() {
  const createOscillatorMock = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine' as const,
  }))

  const createGainMock = vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  }))

  const createBufferMock = vi.fn((_numberOfChannels: number, length: number) => ({
    getChannelData: vi.fn(() => new Float32Array(length)),
  }))

  const createBufferSourceMock = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    buffer: null,
  }))

  const createBiquadFilterMock = vi.fn(() => ({
    connect: vi.fn(),
    type: 'bandpass' as const,
    frequency: { value: 0 },
    Q: { value: 0 },
  }))

  const mockAudioContext = {
    currentTime: 0,
    sampleRate: 44100,
    destination: {},
    createOscillator: createOscillatorMock,
    createGain: createGainMock,
    createBuffer: createBufferMock,
    createBufferSource: createBufferSourceMock,
    createBiquadFilter: createBiquadFilterMock,
  }

  const AudioContextMock = vi.fn(() => mockAudioContext)

  Object.defineProperty(window, 'AudioContext', {
    value: AudioContextMock,
    configurable: true,
    writable: true,
  })

  return {
    AudioContextMock,
    createOscillatorMock,
    createGainMock,
    createBufferMock,
    createBufferSourceMock,
    createBiquadFilterMock,
  }
}
