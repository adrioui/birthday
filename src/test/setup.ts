import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock window.matchMedia for hooks like useReducedMotion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const listeners = new Set<(e: MediaQueryListEvent) => void>();

    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.add(cb);
      },
      removeEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.delete(cb);
      },
      addListener: (cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
      removeListener: (cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
      dispatchEvent: (e: Event) => {
        listeners.forEach((cb) => cb(e as MediaQueryListEvent));
        return true;
      },
    };
  }),
});

// Mock HTMLMediaElement.play (not implemented in jsdom)
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

// Mock GSAP
vi.mock('gsap', () => {
  const createTween = () => ({
    kill: vi.fn(),
  });

  const createTimeline = (config?: { onComplete?: () => void }) => {
    const timeline = {
      to: vi.fn().mockImplementation(() => timeline),
      fromTo: vi.fn().mockImplementation(() => timeline),
      set: vi.fn().mockImplementation(() => timeline),
      kill: vi.fn(),
    };

    const onComplete = config?.onComplete;
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 0);
    }

    return timeline;
  };

  return {
    to: vi.fn(createTween),
    fromTo: vi.fn(createTween),
    set: vi.fn(),
    timeline: vi.fn(createTimeline),
  };
});
