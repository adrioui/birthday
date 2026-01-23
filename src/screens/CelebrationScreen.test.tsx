import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { CelebrationScreen } from './CelebrationScreen';

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
  },
}));

vi.mock('../components/effects/Confetti', () => ({
  Confetti: vi.fn(({ trigger }: { trigger: boolean }) =>
    trigger ? <div data-testid="confetti">Confetti</div> : null
  ),
}));

describe('CelebrationScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<CelebrationScreen />);
    expect(screen.getByText(/Loading celebration\.\.\./i)).toBeInTheDocument();
  });

  it('renders celebration content after loading', () => {
    renderWithProviders(<CelebrationScreen />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText(/HAPPY/i)).toBeInTheDocument();
    expect(screen.getByText(/BIRTHDAY!/i)).toBeInTheDocument();
  });

  it('renders confetti when celebration is active', () => {
    renderWithProviders(<CelebrationScreen />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('confetti')).toBeInTheDocument();
  });

  it('renders progress section', () => {
    renderWithProviders(<CelebrationScreen />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText(/Journey Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
  });

  it('renders restart button', () => {
    renderWithProviders(<CelebrationScreen />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText(/Start Again/i)).toBeInTheDocument();
  });
});
