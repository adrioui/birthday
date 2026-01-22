import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { CharmCardTestScreen } from './CharmCardTestScreen';

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

describe('CharmCardTestScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders charm card test screen', () => {
    renderWithProviders(<CharmCardTestScreen />);
    expect(screen.getByText(/charmcard flip verification - fr-010/i)).toBeInTheDocument();
  });

  it('renders description', () => {
    renderWithProviders(<CharmCardTestScreen />);
    expect(screen.getByText(/testing charm card flip interaction/i)).toBeInTheDocument();
  });

  it('renders verification checklist', () => {
    renderWithProviders(<CharmCardTestScreen />);
    expect(screen.getByText(/manual verification checklist/i)).toBeInTheDocument();
  });

  it('renders phase headers', () => {
    renderWithProviders(<CharmCardTestScreen />);
    expect(screen.getByText(/phase 1 - two-face structure/i)).toBeInTheDocument();
    expect(screen.getByText(/phase 2 - gsap flip animation/i)).toBeInTheDocument();
    expect(screen.getByText(/phase 3 - polish & accessibility/i)).toBeInTheDocument();
  });

  it('renders testing notes', () => {
    renderWithProviders(<CharmCardTestScreen />);
    expect(screen.getByText(/testing notes/i)).toBeInTheDocument();
  });
});
