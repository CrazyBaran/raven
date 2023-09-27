import { test as setup, expect } from '@playwright/test';

const login = process.env['E2E_LOGIN'];
const password = process.env['E2E_PASSWORD'];

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  // await page.goto(
  //   'https://raven-static.test.mubadalacapital.ae/login?redirectUrl=%2F',
  // );
  // await page.waitForURL('/redirectUrl/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill(login);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  // await page.goto(
  //   'https://account.activedirectory.windowsazure.com/securityinfo?isOobe=False&brkr=&brkrVer=3.1.0&clientSku=msal.js.browser&personality=&authMethods=&authMethodCount=',
  // );
  // await page.goto(
  //   'https://mysignins.microsoft.com/api/post/registrationinterrupt',
  // );
  // await page.goto(
  //   'https://mysignins.microsoft.com/register?csrf_token=Ley6w3JAEugSoc5asG39vtDcrySl1eV--aoLg5OwpJZT__xkQXC4zAvII8M5OjbUJK8Kd9-Iag9YUKZ1pXSbbYIpwvIXqMjihnytHdcdUWkhAKcj1VDXEQHj040Mdji0R54da3yDIPwywrs1UKQ--w2&isOobe=False&brkr=&brkrVer=3.1.0&clientSku=msal.js.browser&personality=&authMethods=&authMethodCount=',
  // );
  //await page.waitForSelector('link:text("Skip setup")');
  await page.getByRole('link', { name: 'Skip setup' }).click(); // TODO adapt when the MFA prompt is removed
  await page.getByRole('button', { name: 'Yes' }).click();

  console.log('done');
  await page.getByText('Mubadala').click();
  await page.context().storageState({ path: authFile });
});
