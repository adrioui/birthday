import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - Camcorder Snap + Charm Unlock', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('snap photo unlocks digi-pet charm in wallet', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/camcorder');

    await expect(page.getByTestId('snap-button')).toBeVisible();
    await page.getByTestId('snap-button').click();

    await expect(page.getByTestId('capture-confirmation')).toBeVisible();

    await expect(page.getByText('Awesome!')).toBeVisible();
    await page.getByText('Awesome!').click();

    await page.waitForURL(/\/wallet/);
    await page.waitForTimeout(1000);

    await expect(page.getByTestId('charm-card-digi-pet').first()).toBeVisible();
    await expect(
      page.getByTestId('charm-card-digi-pet').getByText('Digi-Pet').first()
    ).toBeVisible();
  });

  test('charm persists after page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/camcorder');

    await page.getByTestId('snap-button').click();

    await expect(page.getByTestId('capture-confirmation')).toBeVisible();

    await expect(page.getByText('Awesome!')).toBeVisible();
    await page.getByText('Awesome!').click();

    await page.waitForURL(/\/wallet/);

    await expect(page.getByTestId('charm-card-digi-pet').first()).toBeVisible();
  });
});
