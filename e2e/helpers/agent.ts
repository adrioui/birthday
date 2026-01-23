import type { Page } from '@playwright/test';

export async function runAgentAction(page: Page, actionType: string, payload?: unknown) {
  return await page.evaluate(
    ([type, data]) => {
      if (!window.__birthdayOS) {
        throw new Error('Agent bridge not available');
      }
      return window.__birthdayOS.actions.run(type as string, data);
    },
    [actionType, payload]
  );
}

export async function listAgentActions(page: Page) {
  return await page.evaluate(() => {
    if (!window.__birthdayOS) {
      throw new Error('Agent bridge not available');
    }
    return window.__birthdayOS.actions.list();
  });
}

export async function getAgentState(page: Page) {
  return await page.evaluate(() => {
    if (!window.__birthdayOS) {
      throw new Error('Agent bridge not available');
    }
    return window.__birthdayOS.getState();
  });
}
