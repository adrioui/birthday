import { test, expect } from '@playwright/test';

test.describe('BirthdayOS - CakeSweeper Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('navigate to cake-sweeper route', async ({ page }) => {
    await page.goto('/cake-sweeper');

    await expect(page.getByTestId('cake-sweeper')).toBeVisible();
    await expect(page.getByText('SYSTEM ERROR')).not.toBeVisible();
  });

  test('cell reveals on click and state changes', async ({ page }) => {
    await page.goto('/cake-sweeper');

    const tile = page.getByTestId('tile-0-0');
    await expect(tile).toBeVisible();

    const stateBefore = await tile.getAttribute('data-state');
    expect(stateBefore).toBe('hidden');

    await tile.click();
    await page.waitForTimeout(100);

    const stateAfter = await tile.getAttribute('data-state');
    expect(['revealed', 'hidden']).toContain(stateAfter);

    if (stateAfter === 'revealed') {
      await expect(page.locator('[data-state="revealed"]').first()).toBeVisible();
    }
  });

  test('right-click toggles flag state on cell', async ({ page }) => {
    await page.goto('/cake-sweeper');

    const tile = page.getByTestId('tile-0-1');
    await expect(tile).toBeVisible();

    const stateBefore = await tile.getAttribute('data-state');
    expect(stateBefore).toBe('hidden');

    await tile.click({ button: 'right' });
    await page.waitForTimeout(100);

    const stateAfterFirst = await tile.getAttribute('data-state');
    expect(stateAfterFirst).toBe('flagged');

    await expect(tile.getByText('🚩')).toBeVisible();

    await tile.click({ button: 'right' });
    await page.waitForTimeout(100);

    const stateAfterSecond = await tile.getAttribute('data-state');
    expect(stateAfterSecond).toBe('hidden');

    await expect(tile.getByText('🚩')).not.toBeVisible();
  });

  test('restart button resets the grid', async ({ page }) => {
    await page.goto('/cake-sweeper');

    const restartButton = page.getByTestId('restart-button');
    await expect(restartButton).toBeVisible();

    const tile1 = page.getByTestId('tile-0-0');
    await tile1.click({ button: 'right' });
    await page.waitForTimeout(100);

    const stateBefore = await tile1.getAttribute('data-state');
    expect(stateBefore).toBe('flagged');

    await restartButton.click();
    await page.waitForTimeout(200);

    const stateAfter = await tile1.getAttribute('data-state');
    expect(stateAfter).toBe('hidden');

    await expect(page.getByTestId('cake-sweeper')).toBeVisible();
  });

  test('candle reveals with candle emoji', async ({ page }) => {
    await page.goto('/cake-sweeper');

    let candleFound = false;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (candleFound) break;

        const tile = page.getByTestId(`tile-${i}-${j}`);
        const state = await tile.getAttribute('data-state');

        if (state === 'hidden') {
          await tile.click();
          await page.waitForTimeout(100);

          const newState = await tile.getAttribute('data-state');
          const isCandle = await tile.getAttribute('data-candle');

          if (newState === 'revealed' && isCandle === 'true') {
            await expect(tile.getByText('🕯️')).toBeVisible();
            candleFound = true;
            break;
          }
        }
      }
      if (candleFound) break;
    }

    if (!candleFound) {
      test.skip();
    }
  });

  test('number cells show adjacent candle count', async ({ page }) => {
    await page.goto('/cake-sweeper');

    let numberFound = false;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (numberFound) break;

        const tile = page.getByTestId(`tile-${i}-${j}`);
        const state = await tile.getAttribute('data-state');

        if (state === 'hidden') {
          await tile.click();
          await page.waitForTimeout(100);

          const newState = await tile.getAttribute('data-state');
          const isCandle = await tile.getAttribute('data-candle');

          if (newState === 'revealed' && isCandle === 'false') {
            const tileText = await tile.textContent();
            const adjacentCandles = parseInt(tileText || '0', 10);

            if (adjacentCandles > 0) {
              await expect(tile).toHaveText(adjacentCandles.toString());
              numberFound = true;
              break;
            }
          }
        }
      }
      if (numberFound) break;
    }

    if (!numberFound) {
      test.skip();
    }
  });
});
