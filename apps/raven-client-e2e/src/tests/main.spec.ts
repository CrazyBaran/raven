import { test, expect } from '@playwright/test';

test('has title and logout button', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('MUBADALA');
  expect(await page.locator('button').innerText()).toContain('LOGOUT');
});
