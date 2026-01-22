import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/render';
import { CamcorderScreen } from './CamcorderScreen';

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

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../hooks/useCamera', () => ({
  useCamera: vi.fn(() => ({
    videoRef: { current: null },
    state: 'idle',
    error: null,
    startCamera: vi.fn(),
  })),
}));

vi.mock('../hooks/useCapture', () => ({
  useCapture: vi.fn(() => ({
    captureFrame: vi.fn(() => null),
    isCapturing: false,
  })),
}));

vi.mock('../hooks/useAudio', () => ({
  useAudio: vi.fn(() => ({
    playShutterSound: vi.fn(),
  })),
}));

vi.mock('../lib/telemetry', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('../context/CharmContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../context/CharmContext')>();
  return {
    ...actual,
    useCharms: () => ({
      addCharm: vi.fn(),
      addBonusPoints: vi.fn(),
    }),
  };
});

describe('CamcorderScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders camcorder screen', () => {
    renderWithProviders(<CamcorderScreen />);
    expect(screen.getByText(/y2k cam/i)).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<CamcorderScreen />);
    const backButton = screen.getByRole('button', { name: /go back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('renders settings button', () => {
    renderWithProviders(<CamcorderScreen />);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();
  });

  it('renders switch camera button', () => {
    renderWithProviders(<CamcorderScreen />);
    const switchButton = screen.getByRole('button', { name: /switch camera/i });
    expect(switchButton).toBeInTheDocument();
  });

  it('renders snap button', () => {
    renderWithProviders(<CamcorderScreen />);
    const snapButton = screen.getByRole('button', { name: /take a photo/i });
    expect(snapButton).toBeInTheDocument();
  });

  it('renders share button', () => {
    renderWithProviders(<CamcorderScreen />);
    const shareButton = screen.getByRole('button', { name: /share memory/i });
    expect(shareButton).toBeInTheDocument();
  });
});
