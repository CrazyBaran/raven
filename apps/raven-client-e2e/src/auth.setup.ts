import { test as setup } from '@playwright/test';

const login = process.env['E2E_LOGIN'];
const password = process.env['E2E_PASSWORD'];

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  if (!login || !password) {
    throw new Error(
      'E2E_LOGIN and E2E_PASSWORD environment variables must be set',
    );
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill(login);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();

  console.log('done');
  // await page.getByText('Raven').click();
  await page.context().storageState({ path: authFile });
});
