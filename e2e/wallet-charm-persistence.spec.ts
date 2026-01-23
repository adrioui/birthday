import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - Wallet Charm Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('charm persists after page reload and flip state resets', async ({ page }) => {
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

    const stateBefore = await page.evaluate(() => {
      return window.__birthdayOS?.getState();
    });
    expect(stateBefore?.charms).toHaveLength(1);
    expect(stateBefore?.charms[0]?.id).toBe('digi-pet');
    expect(stateBefore?.totalPoints).toBeGreaterThan(0);

    const charmCard = page.getByTestId('charm-card-digi-pet').first();
    await charmCard.click();
    await page.waitForTimeout(500);

    await expect(charmCard.getByText('PWR:')).toBeVisible();

    await page.reload();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId('charm-card-digi-pet').first()).toBeVisible();
    await expect(
      page.getByTestId('charm-card-digi-pet').getByText('Digi-Pet').first()
    ).toBeVisible();

    const stateAfter = await page.evaluate(() => {
      return window.__birthdayOS?.getState();
    });
    expect(stateAfter?.charms).toHaveLength(1);
    expect(stateAfter?.charms[0]?.id).toBe('digi-pet');
    expect(stateAfter?.totalPoints).toBe(stateBefore?.totalPoints);
  });

  test('total points persist across page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/camcorder');

    await page.getByTestId('snap-button').click();

    await expect(page.getByTestId('capture-confirmation')).toBeVisible();
    await page.getByText('Awesome!').click();

    await page.waitForURL(/\/wallet/);
    await page.waitForTimeout(1000);

    const stateBefore = await page.evaluate(() => {
      return window.__birthdayOS?.getState();
    });
    const initialPoints = stateBefore?.totalPoints ?? 0;
    expect(initialPoints).toBeGreaterThan(0);

    await page.reload();
    await page.waitForTimeout(1000);

    const stateAfter = await page.evaluate(() => {
      return window.__birthdayOS?.getState();
    });
    expect(stateAfter?.totalPoints).toBe(initialPoints);
  });

  test('charms persist after unlocking via camcorder', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/camcorder');
    await page.getByTestId('snap-button').click();

    await expect(page.getByTestId('capture-confirmation')).toBeVisible();
    await page.getByText('Awesome!').click();

    await page.waitForURL(/\/wallet/);

    await expect(page.getByTestId('charm-card-digi-pet').first()).toBeVisible();

    await page.goto('/');
    await page.goto('/wallet');

    await expect(page.getByTestId('charm-card-digi-pet').first()).toBeVisible();
    await expect(
      page.getByTestId('charm-card-digi-pet').getByText('Digi-Pet').first()
    ).toBeVisible();
  });
});
