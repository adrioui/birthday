import { test, expect } from './fixtures/birthday-fixtures';

test.describe('BirthdayOS - Agent Bridge', () => {
  test('should expose window.__birthdayOS', async ({ birthdayPage }) => {
    const actions = await birthdayPage.agent.actions.list();
    expect(Array.isArray(actions)).toBe(true);
    expect(actions.length).toBeGreaterThan(0);
  });

  test('should get initial agent state', async ({ birthdayPage }) => {
    const state = await birthdayPage.agent.getState();
    expect(state).toHaveProperty('route');
    expect(state).toHaveProperty('charms');
    expect(state).toHaveProperty('totalPoints');
    expect(state).toHaveProperty('isRedeemed');
  });
});
