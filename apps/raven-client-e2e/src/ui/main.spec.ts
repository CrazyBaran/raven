import { test, expect } from '@playwright/test';

test('has title and logout button', async ({ page }) => {
  await page.goto('/');

  const state = await page.context().storageState();

  console.log(JSON.stringify(state));

  // Expect h1 to contain a title.
  expect(await page.locator('h1').innerText()).toContain('MUBADALA');
  expect(await page.locator('button').innerText()).toContain('LOGOUT');
});
