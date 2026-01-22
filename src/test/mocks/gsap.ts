import { vi } from 'vitest'

const timeline = {
  to: vi.fn().mockReturnThis(),
  fromTo: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  kill: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
}

export const gsap = {
  to: vi.fn(),
  from: vi.fn(),
  fromTo: vi.fn(),
  set: vi.fn(),
  timeline: vi.fn(() => timeline),
  registerPlugin: vi.fn(),
}

export default gsap
