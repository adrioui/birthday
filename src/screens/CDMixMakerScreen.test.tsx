import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { CDMixMakerScreen } from './CDMixMakerScreen';

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

describe('CDMixMakerScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CD mix maker screen', () => {
    renderWithProviders(<CDMixMakerScreen />);
    expect(screen.getByText(/cd mix/i)).toBeInTheDocument();
  });

  it('renders rotating CD emoji', () => {
    renderWithProviders(<CDMixMakerScreen />);
    const cdEmojis = screen.getAllByText(/💿/);
    expect(cdEmojis.length).toBeGreaterThan(0);
  });

  it('renders burn button', () => {
    renderWithProviders(<CDMixMakerScreen />);
    const burnButton = screen.getByRole('button', { name: /add tracks first/i });
    expect(burnButton).toBeInTheDocument();
  });

  it('burn button is disabled when no tracks selected', () => {
    renderWithProviders(<CDMixMakerScreen />);
    const burnButton = screen.getByRole('button', { name: /add tracks first/i });
    expect(burnButton).toBeDisabled();
  });
});
