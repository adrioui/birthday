import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { SMSThreadScreen } from './SMSThreadScreen';

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

vi.mock('../lib/telemetry', () => ({
  trackEvent: vi.fn(),
}));

describe('SMSThreadScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SMS thread screen', () => {
    renderWithProviders(<SMSThreadScreen />);
    expect(screen.getByText(/today 11:59 pm/i)).toBeInTheDocument();
  });

  it('renders chrome floating letters', () => {
    renderWithProviders(<SMSThreadScreen />);
    const hLetter = screen.getByText('H', { selector: 'h1.chrome-text' });
    const bLetter = screen.getByText('B', { selector: 'h1.chrome-text' });
    expect(hLetter).toBeInTheDocument();
    expect(bLetter).toBeInTheDocument();
  });

  it('renders message area', () => {
    renderWithProviders(<SMSThreadScreen />);
    expect(screen.getByText(/today 11:59 pm/i)).toBeInTheDocument();
  });

  it('renders SMS input', () => {
    renderWithProviders(<SMSThreadScreen />);
    expect(screen.getByText(/type a reply/i)).toBeInTheDocument();
  });
});
