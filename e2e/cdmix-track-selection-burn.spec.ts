import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - CDMix Track Selection + Burn', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('navigate to CDMix and add tracks to playlist', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await expect(page.getByTestId('burn-button')).toBeVisible();
    await expect(page.getByText('NO TRACKS SELECTED YET')).toBeVisible();
    await expect(page.getByTestId('burn-button')).toHaveText('ADD TRACKS FIRST');
    await expect(page.getByTestId('burn-button')).toBeDisabled();

    await page.getByTestId('track-1').click();
    await expect(page.getByTestId('playlist-track-1')).toBeVisible();
    await expect(page.getByTestId('playlist-track-1')).toContainText('Birthday Bash (2000 Mix)');
    await expect(page.getByTestId('burn-button')).toHaveText('BURN 1 TRACKS');
    await expect(page.getByTestId('burn-button')).toBeEnabled();
  });

  test('add multiple tracks and verify playlist', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await page.getByTestId('track-1').click();
    await page.getByTestId('track-2').click();
    await page.getByTestId('track-3').click();

    await expect(page.getByTestId('playlist-track-1')).toBeVisible();
    await expect(page.getByTestId('playlist-track-1')).toContainText('Birthday Bash (2000 Mix)');
    await expect(page.getByTestId('playlist-track-2')).toBeVisible();
    await expect(page.getByTestId('playlist-track-2')).toContainText('Digital Dreams');
    await expect(page.getByTestId('playlist-track-3')).toBeVisible();
    await expect(page.getByTestId('playlist-track-3')).toContainText("Party Like It's Y2K");

    await expect(page.getByTestId('burn-button')).toHaveText('BURN 3 TRACKS');
    await expect(page.getByText('YOUR MIX (3/8)')).toBeVisible();
  });

  test('remove track from playlist', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await page.getByTestId('track-1').click();
    await page.getByTestId('track-2').click();

    await expect(page.getByTestId('playlist-track-1')).toBeVisible();
    await expect(page.getByTestId('playlist-track-2')).toBeVisible();

    await page.getByTestId('remove-track-1').click();

    await expect(page.getByTestId('playlist-track-1')).not.toBeVisible();
    await expect(page.getByTestId('playlist-track-2')).toBeVisible();
    await expect(page.getByText('YOUR MIX (1/8)')).toBeVisible();
  });

  test('track toggle behavior - clicking selected track removes it', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await page.getByTestId('track-1').click();
    await expect(page.getByTestId('playlist-track-1')).toBeVisible();
    await expect(page.getByTestId('track-1')).toContainText('✓');

    await page.getByTestId('track-1').click();
    await expect(page.getByTestId('playlist-track-1')).not.toBeVisible();
    await expect(page.getByTestId('track-1')).toContainText('○');
  });

  test('burn CD with tracks', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await page.getByTestId('track-1').click();
    await page.getByTestId('track-2').click();
    await page.getByTestId('track-3').click();

    await page.getByTestId('burn-button').click();

    await expect(page.getByText('READING TRACKS...')).toBeVisible();
    await expect(page.getByText('Track 0 of 3')).toBeVisible();

    await page.getByText('BURNING TO CD...');
    await page.getByText('FINALIZING...');

    await expect(page.getByText('COMPLETE! 🎉')).toBeVisible();
    await expect(page.getByRole('button', { name: 'BURN ANOTHER CD' })).toBeVisible();
    await page.getByRole('button', { name: 'BURN ANOTHER CD' }).click();

    await expect(page.getByTestId('burn-button')).toBeVisible();
    await expect(page.getByTestId('burn-button')).toHaveText('BURN 3 TRACKS');
  });

  test('full flow: add tracks, remove one, burn', async ({ page }) => {
    await page.goto('/cd-mix-maker');

    await page.getByTestId('track-1').click();
    await page.getByTestId('track-2').click();
    await page.getByTestId('track-3').click();
    await page.getByTestId('track-4').click();

    await page.getByTestId('remove-track-2').click();

    await expect(page.getByTestId('playlist-track-1')).toBeVisible();
    await expect(page.getByTestId('playlist-track-2')).not.toBeVisible();
    await expect(page.getByTestId('playlist-track-3')).toBeVisible();
    await expect(page.getByTestId('playlist-track-4')).toBeVisible();

    await page.getByTestId('burn-button').click();

    await page.getByText('READING TRACKS...');
    await page.getByText('COMPLETE! 🎉');

    await expect(page.getByRole('button', { name: 'BURN ANOTHER CD' })).toBeVisible();
    await page.getByRole('button', { name: 'BURN ANOTHER CD' }).click();
    await expect(page.getByTestId('burn-button')).toHaveText('BURN 3 TRACKS');
  });
});
