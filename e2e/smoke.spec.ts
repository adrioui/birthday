import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - Smoke Tests', () => {
  test('app loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BirthdayOS/);
  });

  test('FlipPhone route renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid^="flipphone-"]').first()).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('SMS route renders', async ({ page }) => {
    await page.goto('/sms');
    await expect(page.locator('[data-testid="sms-thread"]')).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('Camcorder route renders', async ({ page }) => {
    await page.goto('/camcorder');
    await expect(page.locator('[data-testid="snap-button"]')).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('Wallet route renders', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page.getByText(/CHARM COLLECTION/i)).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('CakeSweeper route renders', async ({ page }) => {
    await page.goto('/cake-sweeper');
    await expect(page.locator('[data-testid="cake-sweeper"]')).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('CDMix route renders', async ({ page }) => {
    await page.goto('/cd-mix-maker');
    await expect(page.locator('[data-testid="burn-button"]')).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('window.__birthdayOS is exposed', async ({ page }) => {
    await page.goto('/');
    const birthdayOS = await page.evaluate(() => {
      return window.__birthdayOS;
    });
    expect(birthdayOS).toBeDefined();
  });

  test('agentRegistry returns registered actions', async ({ page }) => {
    await page.goto('/');
    const actions = await page.evaluate(() => {
      return window.__birthdayOS?.actions?.list();
    });
    expect(actions).toBeDefined();
    expect(Array.isArray(actions)).toBe(true);
    expect(actions?.length).toBeGreaterThan(0);
  });
});
