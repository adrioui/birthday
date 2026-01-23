import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns false when reduced motion is not preferred', () => {
    const mockMediaQuery = {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('returns true when reduced motion is preferred', () => {
    const mockMediaQuery = {
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('sets up event listener for media query changes', () => {
    const mockMediaQuery = {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    renderHook(() => useReducedMotion());

    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('removes event listener on unmount', () => {
    const mockMediaQuery = {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when matchMedia change event fires', () => {
    const mockMediaQuery = {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList & { addEventListener: ReturnType<typeof vi.fn> };

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      const handler = mockMediaQuery.addEventListener.mock.calls[0][1];
      handler({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it('updates from true to false when preference changes', () => {
    const mockMediaQuery = {
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList & { addEventListener: ReturnType<typeof vi.fn> };

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);

    act(() => {
      const handler = mockMediaQuery.addEventListener.mock.calls[0][1];
      handler({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe(false);
  });
});
