import { test } from '@playwright/test';

/**
 * Component Screenshots - Captures every UI component
 * Run with: npx playwright test e2e/component-screenshots.spec.ts --project=chromium
 */

const SCREENSHOT_DIR = 'screenshots/components';

test.describe('Cake Sweeper Components', () => {
  test('CakeSweeperGrid', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const grid = page.locator('[data-testid="sweeper-grid"], .sweeper-grid, .game-grid').first();
    if (await grid.isVisible()) {
      await grid.screenshot({ path: `${SCREENSHOT_DIR}/cake-sweeper-grid.png` });
    } else {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/cake-sweeper-grid-full.png`, fullPage: true });
    }
  });

  test('CakeSweeperTile', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const tile = page.locator('.cell, .tile, .sweeper-cell, [data-testid="tile"]').first();
    if (await tile.isVisible()) {
      await tile.screenshot({ path: `${SCREENSHOT_DIR}/cake-sweeper-tile.png` });
    }
  });

  test('CounterDisplay', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const counter = page.locator('.counter, .counter-display, [data-testid="counter"]').first();
    if (await counter.isVisible()) {
      await counter.screenshot({ path: `${SCREENSHOT_DIR}/counter-display.png` });
    }
  });

  test('Win95Window', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const window = page.locator('.win95-window, .window, [data-testid="win95-window"]').first();
    if (await window.isVisible()) {
      await window.screenshot({ path: `${SCREENSHOT_DIR}/win95-window.png` });
    }
  });
});

test.describe('Camcorder Components', () => {
  test('ViewfinderOverlay', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const viewfinder = page.locator('.viewfinder, [data-testid="viewfinder"]').first();
    if (await viewfinder.isVisible()) {
      await viewfinder.screenshot({ path: `${SCREENSHOT_DIR}/viewfinder-overlay.png` });
    } else {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/viewfinder-overlay-full.png`, fullPage: true });
    }
  });

  test('SnapButton', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const snapBtn = page.locator('[data-testid="snap-button"], .snap-button, button:has-text("Snap")').first();
    if (await snapBtn.isVisible()) {
      await snapBtn.screenshot({ path: `${SCREENSHOT_DIR}/snap-button.png` });
    }
  });

  test('CRTOverlay', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const crt = page.locator('.crt-overlay, [data-testid="crt-overlay"]').first();
    if (await crt.isVisible()) {
      await crt.screenshot({ path: `${SCREENSHOT_DIR}/crt-overlay.png` });
    }
  });

  test('CameraFallback', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const fallback = page.locator('.camera-fallback, [data-testid="camera-fallback"]').first();
    if (await fallback.isVisible()) {
      await fallback.screenshot({ path: `${SCREENSHOT_DIR}/camera-fallback.png` });
    }
  });
});

test.describe('Effects Components', () => {
  test('Badge', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const badge = page.locator('.badge, [data-testid="badge"]').first();
    if (await badge.isVisible()) {
      await badge.screenshot({ path: `${SCREENSHOT_DIR}/badge.png` });
    }
  });

  test('Sticker', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const sticker = page.locator('.sticker, [data-testid="sticker"]').first();
    if (await sticker.isVisible()) {
      await sticker.screenshot({ path: `${SCREENSHOT_DIR}/sticker.png` });
    }
  });

  test('FloatingChromeText', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const chrome = page.locator('.chrome-text, .floating-text, [data-testid="chrome-text"]').first();
    if (await chrome.isVisible()) {
      await chrome.screenshot({ path: `${SCREENSHOT_DIR}/floating-chrome-text.png` });
    }
  });

  test('GlitchOverlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const glitch = page.locator('.glitch-overlay, [data-testid="glitch-overlay"]').first();
    if (await glitch.isVisible()) {
      await glitch.screenshot({ path: `${SCREENSHOT_DIR}/glitch-overlay.png` });
    }
  });

  test('Confetti', async ({ page }) => {
    await page.goto('/celebration');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/confetti-full.png`, fullPage: true });
  });
});

test.describe('Overlay Components', () => {
  test('ScanlineOverlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const scanline = page.locator('[data-testid="scanline-overlay"], .scanline-overlay').first();
    if (await scanline.isVisible()) {
      await scanline.screenshot({ path: `${SCREENSHOT_DIR}/scanline-overlay.png` });
    } else {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/scanline-overlay-full.png`, fullPage: true });
    }
  });

  test('NoiseOverlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const noise = page.locator('.noise-overlay, [data-testid="noise-overlay"]').first();
    if (await noise.isVisible()) {
      await noise.screenshot({ path: `${SCREENSHOT_DIR}/noise-overlay.png` });
    }
  });
});

test.describe('SMS Components', () => {
  test('SMSHeader', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const header = page.locator('.sms-header, [data-testid="sms-header"], header').first();
    if (await header.isVisible()) {
      await header.screenshot({ path: `${SCREENSHOT_DIR}/sms-header.png` });
    }
  });

  test('MessageBubble', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const bubble = page.locator('.message-bubble, .bubble, [data-testid="message-bubble"]').first();
    if (await bubble.isVisible()) {
      await bubble.screenshot({ path: `${SCREENSHOT_DIR}/message-bubble.png` });
    }
  });

  test('GiftCardAttachment', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const giftCard = page.locator('.gift-card, .attachment, [data-testid="gift-card"]').first();
    if (await giftCard.isVisible()) {
      await giftCard.scrollIntoViewIfNeeded();
      await giftCard.screenshot({ path: `${SCREENSHOT_DIR}/gift-card-attachment.png` });
    }
  });

  test('SMSInputBar', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const inputBar = page.locator('.sms-input, .input-bar, [data-testid="sms-input"]').first();
    if (await inputBar.isVisible()) {
      await inputBar.screenshot({ path: `${SCREENSHOT_DIR}/sms-input-bar.png` });
    }
  });

  test('HeartStickers', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const hearts = page.locator('.heart-stickers, [data-testid="heart-stickers"]').first();
    if (await hearts.isVisible()) {
      await hearts.screenshot({ path: `${SCREENSHOT_DIR}/heart-stickers.png` });
    }
  });
});

test.describe('UI Components', () => {
  test('SoundToggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const toggle = page.locator('.sound-toggle, [data-testid="sound-toggle"], button[aria-label*="sound"]').first();
    if (await toggle.isVisible()) {
      await toggle.screenshot({ path: `${SCREENSHOT_DIR}/sound-toggle.png` });
    }
  });

  test('Tooltip', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // Hover to trigger tooltip
    const tooltipTrigger = page.locator('[data-tooltip], [title]').first();
    if (await tooltipTrigger.isVisible()) {
      await tooltipTrigger.hover();
      await page.waitForTimeout(300);
      const tooltip = page.locator('.tooltip, [role="tooltip"]').first();
      if (await tooltip.isVisible()) {
        await tooltip.screenshot({ path: `${SCREENSHOT_DIR}/tooltip.png` });
      }
    }
  });

  test('PerformanceModeIndicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const indicator = page.locator('.performance-indicator, [data-testid="performance-indicator"]').first();
    if (await indicator.isVisible()) {
      await indicator.screenshot({ path: `${SCREENSHOT_DIR}/performance-mode-indicator.png` });
    }
  });
});

test.describe('Wallet Components', () => {
  test('WalletHeader', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const header = page.locator('.wallet-header, [data-testid="wallet-header"], header').first();
    if (await header.isVisible()) {
      await header.screenshot({ path: `${SCREENSHOT_DIR}/wallet-header.png` });
    }
  });

  test('CharmCard', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const card = page.locator('.charm-card, [data-testid="charm-card"]').first();
    if (await card.isVisible()) {
      await card.screenshot({ path: `${SCREENSHOT_DIR}/charm-card.png` });
    }
  });

  test('CharmCard flipped', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const card = page.locator('.charm-card, [data-testid="charm-card"]').first();
    if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(500);
      await card.screenshot({ path: `${SCREENSHOT_DIR}/charm-card-flipped.png` });
    }
  });

  test('WalletFooter', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const footer = page.locator('.wallet-footer, [data-testid="wallet-footer"], footer').first();
    if (await footer.isVisible()) {
      await footer.screenshot({ path: `${SCREENSHOT_DIR}/wallet-footer.png` });
    }
  });

  test('WalletEmptyState', async ({ page }) => {
    // Clear localStorage to show empty state
    await page.goto('/wallet');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const empty = page.locator('.empty-state, [data-testid="empty-state"]').first();
    if (await empty.isVisible()) {
      await empty.screenshot({ path: `${SCREENSHOT_DIR}/wallet-empty-state.png` });
    }
  });
});

test.describe('Root Components', () => {
  test('FlipPhone', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const phone = page.locator('.flip-phone, [data-testid="flip-phone"]').first();
    if (await phone.isVisible()) {
      await phone.screenshot({ path: `${SCREENSHOT_DIR}/flip-phone.png` });
    } else {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/flip-phone-full.png`, fullPage: true });
    }
  });

  test('CardBackground', async ({ page }) => {
    await page.goto('/charm-test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const bg = page.locator('.card-background, [data-testid="card-background"]').first();
    if (await bg.isVisible()) {
      await bg.screenshot({ path: `${SCREENSHOT_DIR}/card-background.png` });
    }
  });

  test('ScreenBackground', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const bg = page.locator('.screen-background, [data-testid="screen-background"]').first();
    if (await bg.isVisible()) {
      await bg.screenshot({ path: `${SCREENSHOT_DIR}/screen-background.png` });
    }
  });

  test('AppLayout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/app-layout.png`, fullPage: true });
  });
});

test.describe('Progress Components', () => {
  test('SessionProgress', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const progress = page.locator('.session-progress, [data-testid="session-progress"]').first();
    if (await progress.isVisible()) {
      await progress.screenshot({ path: `${SCREENSHOT_DIR}/session-progress.png` });
    }
  });
});
