import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in.
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Curvestone QA Auto').click();
});

test.describe('Raven Regression: Pages', () => {
  test('Raven Regression: Pages: Home Dashboard', async ({ page }) => {
    // Arrange
    const getToken = await page.request.get(
      'https://login.microsoftonline.com/**/oauth2/v2.0/token',
    );

    // Act

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page.getByRole('img')).toBeVisible();
    await expect(getToken).toBeOK();
  });

  test('Raven Regression: Pages: All Companies', async ({ page }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'All Companies' }).click();

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page.getByRole('img')).toBeVisible();
    await expect(page).toHaveURL('/companies');
  });

  test('Raven Regression: Pages: Pipeline', async ({ page }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();

    // Assert
    await expect(page).toHaveURL('/companies/pipeline');
    await expect(page).toHaveTitle('Raven');
    await expect(page.getByRole('heading', { name: 'Pipeline' })).toBeVisible();
    await expect(page.getByText('Lead', { exact: true })).toBeVisible();
    await expect(page.getByText('Screening')).toBeVisible();
    await expect(page.getByText('1st Call / Meeting')).toBeVisible();
    await expect(page.getByText('Initial DD')).toBeVisible();
    await expect(page.getByText('Active / Live')).toBeVisible();
    await expect(page.getByText('Portfolio')).toBeVisible();
    await expect(page.getByText('Passed - 1st Meeting / Call')).toBeVisible();
    await expect(page.getByText('Passed - No Deck/website Only')).toBeVisible();
    await expect(page.getByText('Passed - Reviewed Deck')).toBeVisible();
    await expect(page.getByText('Passed - Company Not Engaged')).toBeVisible();
    await expect(page.getByText('Passed - Activation')).toBeVisible();
    await expect(page.getByText('Passed - Intial DD')).toBeVisible();
    await expect(
      page.getByText('Passed - Intel From Another Fund'),
    ).toBeVisible();
    await expect(page.getByText('Lost - Term Sheet')).toBeVisible();
  });

  test('Raven Regression: Pages: Opportunity Detailed View', async ({
    page,
  }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();
    await page
      .locator('app-opportunities-card')
      .filter({ hasText: 'createTest createTest.com' })
      .getByRole('button')
      .click();

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL(new RegExp('/companies/opportunities/'));
  });

  test('Raven Regression: Pages: All Notes', async ({ page }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Notes' }).click();
    await page.getByRole('link', { name: 'All Notes' }).click();

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL('/notes');
    await expect(
      page.getByRole('heading', { name: 'All Notes' }),
    ).toBeVisible();
    await expect(page.getByText('Quick filters')).toBeVisible();
    await expect(
      page.getByText(
        'Created by me I am tagged All Note Types Company Call Investor Call Market Expert Call',
      ),
    ).toBeVisible();
    await expect(page.getByText('Note Title')).toBeVisible();
    await expect(page.getByText('Note Type').first()).toBeVisible();
    await expect(page.getByText('Updated').first()).toBeVisible();
    await expect(page.getByText('People')).toBeVisible();
    await expect(page.getByText('Tags')).toBeVisible();
  });
});

/* test.describe('Raven Regression: Notetaking Flow', () => {
  test('Raven Regression: Notetaking Flow: Note Creation (sidebar collapsed) - untagged note', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Creation (sidebar expanded) - untagged note', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Creation (sidebar collapsed) - tagged note', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Access - All Notes', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Access - Opportunity View (tagged note)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Creation - unsaved changes alert', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Content Update', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Tags Update', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Template Update', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: New Tag Creation (Company)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: New Tag Creation (Industry)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });
  test('Raven Regression: Notetaking Flow: New Tag Creation (Investor)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: New Tag Creation (Business Model)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Deletion (All Notes page)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });
  test('Raven Regression: Notetaking Flow: Note Deletion (Opportunity page)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note Deletion (Detailed Note View)', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });

  test('Raven Regression: Notetaking Flow: Note URL copy to clipboard', async ({
    page,
  }) => {
    // Arrange
    // Act
    // Assert
  });
});
*/
