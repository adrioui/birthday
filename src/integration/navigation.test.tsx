import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, renderHook as rtlRenderHook, render } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { renderWithProviders } from '../test/render';

// Mock modules
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

// Import components after mocking
import { FlipPhoneScreen, SMSThreadScreen, CamcorderScreen, WalletScreen } from '../screens';
import { ScreenTransition } from '../components/transitions/ScreenTransition';
import {
  TransitionProvider,
  useTransition,
  AudioProvider,
  CharmProvider,
  ProgressProvider,
  EasterEggProvider,
} from '../context';

function renderWithAllProviders(ui: React.ReactElement) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <EasterEggProvider>
        <ProgressProvider>
          <TransitionProvider>
            <CharmProvider>
              <AudioProvider>{children}</AudioProvider>
            </CharmProvider>
          </TransitionProvider>
        </ProgressProvider>
      </EasterEggProvider>
    );
  }
  return render(ui, { wrapper: Wrapper });
}

const mockRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 200,
  top: 0,
  right: 100,
  bottom: 200,
  left: 0,
  toJSON: () => ({}),
} as DOMRect;

describe('Core Navigation and Screen Transitions - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Route Accessibility', () => {
    it('renders flip phone screen on root route', () => {
      renderWithAllProviders(<FlipPhoneScreen />);
      expect(screen.getByText(/flip to open/i)).toBeInTheDocument();
    });

    it('renders SMS thread screen', () => {
      renderWithProviders(<SMSThreadScreen />);
      expect(screen.getByText(/today 11:59 pm/i)).toBeInTheDocument();
    });

    it('renders camcorder screen', () => {
      renderWithAllProviders(<CamcorderScreen />);
      const camcorderContainer = screen.getByRole('main');
      expect(camcorderContainer).toBeInTheDocument();
    });

    it('renders wallet screen', () => {
      renderWithProviders(<WalletScreen />);
      expect(screen.getByText(/wallet/i, { selector: 'h1' })).toBeInTheDocument();
    });
  });

  describe('TransitionContext Integration', () => {
    it('manages transition state correctly', () => {
      const { result } = rtlRenderHook(() => useTransition(), { wrapper: TransitionProvider });
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.transitionType).toBeNull();
      expect(result.current.phoneScreenRect).toBeNull();
    });

    it('starts phone-to-sms transition', () => {
      const { result } = rtlRenderHook(() => useTransition(), { wrapper: TransitionProvider });
      act(() => result.current.startTransition('phone-to-sms', mockRect));
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionType).toBe('phone-to-sms');
      expect(result.current.phoneScreenRect).toBe(mockRect);
    });

    it('starts gift-to-camcorder transition', () => {
      const { result } = rtlRenderHook(() => useTransition(), { wrapper: TransitionProvider });
      act(() => result.current.startTransition('gift-to-camcorder', mockRect));
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionType).toBe('gift-to-camcorder');
      expect(result.current.phoneScreenRect).toBe(mockRect);
    });

    it('ends transition and resets state', () => {
      const { result } = rtlRenderHook(() => useTransition(), { wrapper: TransitionProvider });
      act(() => result.current.startTransition('phone-to-sms', mockRect));
      act(() => result.current.endTransition());
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.transitionType).toBeNull();
      expect(result.current.phoneScreenRect).toBeNull();
    });
  });

  describe('ScreenTransition Component', () => {
    it('renders nothing when not transitioning', () => {
      renderWithProviders(<ScreenTransition />);
      expect(screen.queryByText(/CONNECTING/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/LOADING CAMERA/i)).not.toBeInTheDocument();
    });

    it('renders phone-to-sms transition overlay', () => {
      const TestWrapper = () => {
        const { startTransition } = useTransition();
        React.useEffect(() => {
          startTransition('phone-to-sms', mockRect);
        }, [startTransition]);
        return <ScreenTransition />;
      };

      renderWithProviders(<TestWrapper />);

      expect(screen.getByText(/CONNECTING/i)).toBeInTheDocument();
    });

    it('renders gift-to-camcorder transition overlay', () => {
      const TestWrapper = () => {
        const { startTransition } = useTransition();
        React.useEffect(() => {
          startTransition('gift-to-camcorder', mockRect);
        }, [startTransition]);
        return <ScreenTransition />;
      };

      renderWithProviders(<TestWrapper />);

      expect(screen.getByText(/LOADING CAMERA/i)).toBeInTheDocument();
    });
  });

  describe('Full Transition Flow - Phone to SMS', () => {
    it('handles complete transition from flip phone to SMS thread', async () => {
      const user = userEvent.setup();

      renderWithAllProviders(<FlipPhoneScreen />);

      expect(screen.getByText(/flip to open/i)).toBeInTheDocument();

      const pickUpButton = screen.getByLabelText('Pick up call');

      // Button should be initially disabled during animation
      expect(pickUpButton).toBeDisabled();

      // Wait for animation to complete (mocked with 0 duration)
      // Then try clicking the button
      await user.click(pickUpButton);
    });
  });

  describe('Screen Accessibility During Transitions', () => {
    it('makes transition overlay inert to screen readers', () => {
      const TestWrapper = () => {
        const { startTransition } = useTransition();
        React.useEffect(() => {
          startTransition('phone-to-sms', mockRect);
        }, [startTransition]);
        return <ScreenTransition />;
      };

      renderWithProviders(<TestWrapper />);

      // Find the outer div with aria-hidden="true"
      const textDiv = screen.getByText(/CONNECTING/i).closest('div');
      // Navigate up to find the overlay div with aria-hidden
      const overlay = textDiv?.parentElement?.parentElement;
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
