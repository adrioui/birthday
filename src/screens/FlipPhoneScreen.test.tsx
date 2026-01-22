import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { FlipPhoneScreen } from './FlipPhoneScreen';

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

describe('FlipPhoneScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders flip phone screen', () => {
    renderWithProviders(<FlipPhoneScreen />);
    expect(screen.getByText(/flip to open/i)).toBeInTheDocument();
  });

  it('renders chrome floating letters', () => {
    renderWithProviders(<FlipPhoneScreen />);
    const hLetter = screen.getByText('H', { selector: 'h1.chrome-text' });
    const bLetter = screen.getByText('B', { selector: 'h1.chrome-text' });
    expect(hLetter).toBeInTheDocument();
    expect(bLetter).toBeInTheDocument();
  });

  it('shows swipe instructions', () => {
    renderWithProviders(<FlipPhoneScreen />);
    expect(screen.getByText(/swipe to reject/i)).toBeInTheDocument();
  });
});
