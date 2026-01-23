/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, Page } from '@playwright/test';

type AgentBridge = {
  actions: {
    run: (
      actionType: string,
      payload?: unknown
    ) => Promise<{ ok: boolean; data?: unknown; errorCode?: string; message?: string }>;
    list: () => string[];
  };
  getState: () => {
    route: string;
    charms: { id: string; name: string; points: number }[];
    totalPoints: number;
    isRedeemed: boolean;
  };
};

type BirthdayOSPage = Page & {
  agent: AgentBridge;
};

export const test = base.extend<{ birthdayPage: BirthdayOSPage }>({
  birthdayPage: async ({ page }, use) => {
    await page.goto('/');

    const agent = await page.evaluate(() => {
      const bridge = window.__birthdayOS;
      if (!bridge) {
        throw new Error('Agent bridge not exposed. Check window.__birthdayOS');
      }
      return bridge;
    });

    const birthdayPage = Object.create(page, {
      agent: { value: agent, enumerable: true, configurable: true, writable: true },
    });
    await use(birthdayPage as Page & { agent: typeof agent });
  },
});

export { expect } from '@playwright/test';
