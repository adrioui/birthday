import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
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
  });

  it('renders cake sweeper screen', () => {
    renderWithProviders(<CakeSweeperScreen />);
    expect(screen.getByText(/cake sweeper/i)).toBeInTheDocument();
  });

  it('renders cake emoji', () => {
    renderWithProviders(<CakeSweeperScreen />);
    const cakeEmoji = screen.getByText(/🎂/);
    expect(cakeEmoji).toBeInTheDocument();
  });

  it('renders game grid', () => {
    renderWithProviders(<CakeSweeperScreen />);
    const grid = screen.getByRole('grid', { name: /cake sweeper game grid/i });
    expect(grid).toBeInTheDocument();
  });

  it('renders new game button', () => {
    renderWithProviders(<CakeSweeperScreen />);
    const newGameButton = screen.getByRole('button', { name: /new game/i });
    expect(newGameButton).toBeInTheDocument();
  });

  it('renders game instructions', () => {
    renderWithProviders(<CakeSweeperScreen />);
    expect(screen.getByText(/left-click: reveal/i)).toBeInTheDocument();
    expect(screen.getByText(/right-click: flag/i)).toBeInTheDocument();
  });
});
