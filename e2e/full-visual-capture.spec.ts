import { test } from '@playwright/test';

/**
 * Full Visual Capture - Screenshots every feature and interaction
 * Run with: npx playwright test e2e/full-visual-capture.spec.ts --project=chromium
 */

test.describe('FlipPhone Screen', () => {
  test('initial state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/01-flipphone-initial.png', fullPage: true });
  });

  test('phone open state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Try to open/interact with phone
    const phone = page.locator('.flip-phone, [data-testid="flip-phone"], .phone-container').first();
    if (await phone.isVisible()) {
      await phone.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'screenshots/02-flipphone-interacted.png', fullPage: true });
  });
});

test.describe('SMS Thread Screen', () => {
  test('sms thread view', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/03-sms-thread.png', fullPage: true });
  });

  test('sms scroll interactions', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll to see more messages
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/04-sms-scrolled.png', fullPage: true });
  });

  test('gift card attachment', async ({ page }) => {
    await page.goto('/sms');
    await page.waitForLoadState('networkidle');

    // Look for gift card element
    const giftCard = page.locator('[data-testid="gift-card"], .gift-card, .attachment').first();
    if (await giftCard.isVisible()) {
      await giftCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'screenshots/05-sms-giftcard.png', fullPage: true });
  });
});

test.describe('Camcorder Screen', () => {
  test('camcorder initial', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/06-camcorder-initial.png', fullPage: true });
  });

  test('camcorder viewfinder', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Look for viewfinder/REC elements
    const viewfinder = page
      .locator('.viewfinder, [data-testid="viewfinder"], .camcorder-view')
      .first();
    if (await viewfinder.isVisible()) {
      await page.screenshot({ path: 'screenshots/07-camcorder-viewfinder.png', fullPage: true });
    }
  });

  test('camcorder snap action', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Try snap/capture button
    const snapButton = page
      .locator(
        '[data-testid="snap-button"], .snap-button, button:has-text("Snap"), button:has-text("Capture")'
      )
      .first();
    if (await snapButton.isVisible()) {
      await snapButton.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'screenshots/08-camcorder-snapped.png', fullPage: true });
  });
});

test.describe('Wallet Screen', () => {
  test('wallet initial', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/09-wallet-initial.png', fullPage: true });
  });

  test('wallet charms collection', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Look for charm elements
    const charms = page.locator('.charm, [data-testid="charm"], .charm-card');
    const count = await charms.count();
    if (count > 0) {
      await charms.first().scrollIntoViewIfNeeded();
    }
    await page.screenshot({ path: 'screenshots/10-wallet-charms.png', fullPage: true });
  });

  test('wallet charm flip interaction', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Try to flip a charm
    const charm = page.locator('.charm, [data-testid="charm"], .charm-card').first();
    if (await charm.isVisible()) {
      await charm.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'screenshots/11-wallet-charm-flipped.png', fullPage: true });
  });

  test('wallet points display', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');

    const points = page.locator('.points, [data-testid="points"], .total-points').first();
    if (await points.isVisible()) {
      await points.scrollIntoViewIfNeeded();
    }
    await page.screenshot({ path: 'screenshots/12-wallet-points.png', fullPage: true });
  });
});

test.describe('CakeSweeper Screen', () => {
  test('cake sweeper game', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/13-cakesweeper-initial.png', fullPage: true });
  });

  test('cake sweeper grid', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Click a cell
    const cell = page.locator('.cell, [data-testid="cell"], .grid-cell, .sweeper-cell').first();
    if (await cell.isVisible()) {
      await cell.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'screenshots/14-cakesweeper-clicked.png', fullPage: true });
  });

  test('cake sweeper flag action', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Right-click to flag
    const cell = page.locator('.cell, [data-testid="cell"], .grid-cell, .sweeper-cell').nth(1);
    if (await cell.isVisible()) {
      await cell.click({ button: 'right' });
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'screenshots/15-cakesweeper-flagged.png', fullPage: true });
  });
});

test.describe('CDMix Screen', () => {
  test('cdmix initial', async ({ page }) => {
    await page.goto('/cd-mix-maker');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/16-cdmix-initial.png', fullPage: true });
  });

  test('cdmix track selection', async ({ page }) => {
    await page.goto('/cd-mix-maker');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Select a track
    const track = page.locator('.track, [data-testid="track"], .track-item').first();
    if (await track.isVisible()) {
      await track.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'screenshots/17-cdmix-track-selected.png', fullPage: true });
  });

  test('cdmix burn action', async ({ page }) => {
    await page.goto('/cd-mix-maker');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Try burn button
    const burnButton = page
      .locator('[data-testid="burn-button"], button:has-text("Burn"), .burn-btn')
      .first();
    if (await burnButton.isVisible()) {
      await burnButton.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'screenshots/18-cdmix-burning.png', fullPage: true });
  });
});

test.describe('Celebration Screen', () => {
  test('celebration view', async ({ page }) => {
    await page.goto('/celebration');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/19-celebration.png', fullPage: true });
  });
});

test.describe('Memory Snapshot Screen', () => {
  test('memory snapshot view', async ({ page }) => {
    await page.goto('/memory-snapshot');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/20-memory-snapshot.png', fullPage: true });
  });
});

test.describe('Charm Card Test Screen', () => {
  test('charm card test view', async ({ page }) => {
    await page.goto('/charm-test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/21-charm-card-test.png', fullPage: true });
  });
});

test.describe('Transitions & Effects', () => {
  test('phone to sms transition', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for phone open animation

    // Click Pick Up button
    const pickUpBtn = page.locator('button[aria-label="Pick up call"]');
    if (await pickUpBtn.isVisible()) {
      await pickUpBtn.click();
      await page.waitForTimeout(500); // Capture mid-transition
      await page.screenshot({ path: 'screenshots/22-transition-phone-sms.png', fullPage: true });
    }
  });

  test('crt scanlines effect', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check for CRT effect overlay
    const crtEffect = page.locator('[data-testid="scanline-overlay"]').first();
    if (await crtEffect.isVisible()) {
      await page.screenshot({ path: 'screenshots/23-crt-effect.png', fullPage: true });
    }
  });
});
