import { test, expect } from '@playwright/test';

/**
 * Visual Capture Tests
 * 
 * These tests capture screenshots of key screens for agent-driven visual verification.
 * Run with: npx playwright test e2e/visual-capture.spec.ts --project=chromium
 */

test.describe('BirthdayOS Visual Capture', () => {
  test('capture flipphone screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('flipphone.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('capture sms screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to SMS (adjust selector based on actual implementation)
    const smsButton = page.locator('[data-testid="sms-button"], button:has-text("Messages"), .sms-trigger').first();
    if (await smsButton.isVisible()) {
      await smsButton.click();
      await page.waitForTimeout(500); // Wait for transition
    }
    
    await expect(page).toHaveScreenshot('sms.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('capture camcorder screen', async ({ page }) => {
    await page.goto('/camcorder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for any animations
    
    await expect(page).toHaveScreenshot('camcorder.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('capture wallet screen', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for any animations
    
    await expect(page).toHaveScreenshot('wallet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
