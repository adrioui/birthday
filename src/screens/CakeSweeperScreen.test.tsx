import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { CakeSweeperScreen } from './CakeSweeperScreen';

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

vi.mock('../context/useProgress', () => ({
  useProgress: () => ({
    completeMilestone: vi.fn(),
  }),
}));

describe('CakeSweeperScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const waitForGameToLoad = () => {
    act(() => {
      vi.advanceTimersByTime(3000);
    });
  };

  it('renders cake sweeper screen', () => {
    renderWithProviders(<CakeSweeperScreen />);
    waitForGameToLoad();
    expect(screen.getByRole('heading', { name: /cake sweeper/i })).toBeInTheDocument();
  });

  it('renders cake emoji', () => {
    renderWithProviders(<CakeSweeperScreen />);
    waitForGameToLoad();
    const cakeEmoji = screen.getByText(/🎂/);
    expect(cakeEmoji).toBeInTheDocument();
  });

  it('renders game grid', () => {
    renderWithProviders(<CakeSweeperScreen />);
    waitForGameToLoad();
    const grid = screen.getByRole('grid', { name: /cake sweeper game grid/i });
    expect(grid).toBeInTheDocument();
  });

  it('renders new game button', () => {
    renderWithProviders(<CakeSweeperScreen />);
    waitForGameToLoad();
    const newGameButton = screen.getByRole('button', { name: /new game/i });
    expect(newGameButton).toBeInTheDocument();
  });

  it('renders game instructions', () => {
    renderWithProviders(<CakeSweeperScreen />);
    waitForGameToLoad();
    expect(screen.getByText(/left-click: reveal/i)).toBeInTheDocument();
    expect(screen.getByText(/right-click: flag/i)).toBeInTheDocument();
  });
});
