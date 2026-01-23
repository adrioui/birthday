import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - FlipPhone to SMS Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });
  test('navigate from FlipPhone to SMS thread', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('flipphone-pickup')).toBeVisible();
    await page.getByTestId('flipphone-pickup').click();

    await expect(page).toHaveURL(/\/sms/);
    await expect(page.getByTestId('sms-thread')).toBeVisible();
  });

  test('open gift card modal from SMS thread', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('flipphone-pickup').click();

    await expect(page.getByTestId('sms-giftcard')).toBeVisible();
    await page.getByTestId('sms-giftcard').click();

    await expect(page.getByTestId('gift-modal')).toBeVisible();
    await expect(page.getByTestId('gift-modal').getByText('GIFT CARD')).toBeAttached();
    await expect(
      page.getByTestId('gift-modal').getByText('Tap to unwrap your gift')
    ).toBeAttached();
  });
});
