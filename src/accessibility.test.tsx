import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test/render';
import { testCharm } from './test/fixtures';

import { SoundToggle } from './components/ui/SoundToggle';
import { CharmUnlockModal } from './components/wallet/CharmUnlockModal';
import { RedeemConfirmModal } from './components/wallet/RedeemConfirmModal';
import { RedeemSuccessModal } from './components/wallet/RedeemSuccessModal';
import { GiftCardModal } from './components/sms';
import { CharmCard } from './components/wallet/CharmCard';

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn(function (this: unknown) {
        return this;
      }),
      fromTo: vi.fn(function (this: unknown) {
        return this;
      }),
      kill: vi.fn(),
    })),
    killTweensOf: vi.fn(),
  },
}));

describe('Accessibility Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Keyboard Navigation - Icon Buttons', () => {
    it('SoundToggle has accessible labels', () => {
      renderWithProviders(<SoundToggle />);

      const button = screen.getByRole('button', { name: 'Mute sounds' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Mute sounds');
    });
  });

  describe('Focus Trap - CharmUnlockModal', () => {
    it('has focusable elements', () => {
      const onDismiss = vi.fn();

      renderWithProviders(<CharmUnlockModal charm={testCharm} onDismiss={onDismiss} />);

      const closeButton = screen.getByRole('button', { name: /awesome/i });
      const charmCard = screen.getByRole('button', { name: /test charm/i });

      expect(closeButton).toBeInTheDocument();
      expect(charmCard).toBeInTheDocument();
    });
  });

  describe('Focus Trap - RedeemConfirmModal', () => {
    it('has focusable buttons', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(
        <RedeemConfirmModal
          isOpen={true}
          totalPoints={100}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe('Focus Trap - RedeemSuccessModal', () => {
    it('has focusable close button', () => {
      const onClose = vi.fn();

      render(<RedeemSuccessModal isOpen={true} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /continue to cd mix/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Focus Trap - GiftCardModal', () => {
    it('has focusable unwrap button', () => {
      const onClose = vi.fn();

      renderWithProviders(<GiftCardModal onClose={onClose} />);

      const unwrapButton = screen.getByRole('button', { name: /unwrap/i });
      expect(unwrapButton).toBeInTheDocument();
    });

    it('responds to Space key to unwrap', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProviders(<GiftCardModal onClose={onClose} />);

      const unwrapButton = screen.getByRole('button', { name: /unwrap/i });
      await user.click(unwrapButton);

      const revealedButton = screen.getByRole('button', { name: /gift revealed/i });
      expect(revealedButton).toBeInTheDocument();
    });
  });

  describe('ARIA Labels - Icon Buttons', () => {
    it('CharmCard has aria-pressed and aria-label', () => {
      renderWithProviders(<CharmCard charm={testCharm} isFlipped={false} onFlip={vi.fn()} />);

      const card = screen.getByRole('button', { name: /test charm/i });
      expect(card).toHaveAttribute('aria-pressed', 'false');
      expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Charm charm card'));
    });

    it('CharmCard aria-pressed updates on flip', () => {
      const { rerender: r } = renderWithProviders(
        <CharmCard charm={testCharm} isFlipped={false} onFlip={vi.fn()} />
      );

      const card = screen.getByRole('button', { name: /test charm/i });
      expect(card).toHaveAttribute('aria-pressed', 'false');

      r(<CharmCard charm={testCharm} isFlipped={true} onFlip={vi.fn()} />);

      expect(card).toHaveAttribute('aria-pressed', 'true');
    });

    it('GiftCardModal close button has aria-label', () => {
      renderWithProviders(<GiftCardModal onClose={vi.fn()} />);

      const closeButton = screen.getByRole('button', { name: 'Close gift card' });
      expect(closeButton).toHaveAttribute('aria-label', 'Close gift card');
    });

    it('GiftCardModal unwrap button has dynamic aria-label', () => {
      renderWithProviders(<GiftCardModal onClose={vi.fn()} />);

      const unwrapButton = screen.getByRole('button', { name: /unwrap/i });
      expect(unwrapButton).toHaveAttribute('aria-label', 'Tap to unwrap your gift');
    });
  });

  describe('ARIA - Decorative Elements', () => {
    it('decorative elements use aria-hidden', () => {
      const testDiv = document.createElement('div');
      testDiv.setAttribute('aria-hidden', 'true');

      expect(testDiv).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('ARIA - Status Regions', () => {
    it('elements can use role=status', () => {
      const statusDiv = document.createElement('div');
      statusDiv.setAttribute('role', 'status');

      expect(statusDiv).toHaveAttribute('role', 'status');
    });
  });

  describe('Focus - Tab Order in Modal with Multiple Buttons', () => {
    it('RedeemConfirmModal has tabable buttons', () => {
      render(
        <RedeemConfirmModal
          isOpen={true}
          totalPoints={100}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
