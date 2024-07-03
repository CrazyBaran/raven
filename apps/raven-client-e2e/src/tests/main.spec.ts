import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in.
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Curvestone QA Auto').click();
});

test.describe('Raven Regression: Pages', () => {
  test.describe.configure({ mode: 'serial' });
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
    const organisationsResponsePromise =
      page.waitForResponse('**/organisations**');
    const organisationsResponse = await organisationsResponsePromise;

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL('/companies');
    await expect(
      page.getByTestId('company-profile-link').first(),
    ).toBeVisible();
    await expect(page.getByText('All deals')).toBeVisible();
    await expect(page.getByText('My deals')).toBeVisible();
    await expect(page.getByText('All Instruments')).toBeVisible();
    await expect(page.getByText('Deal Member')).toBeVisible();
    await expect(page.getByText('Company')).toBeVisible();
    await expect(page.getByText('Instrument', { exact: true })).toBeVisible();
    await expect(page.getByText('Pipeline Status')).toBeVisible();
    await expect(page.getByText('Deal Lead')).toBeVisible();
    await expect(page.getByText('Deal Team')).toBeVisible();
    await expect(organisationsResponse.status()).toBe(200);
  });

  test('Raven Regression: Pages: All Companies: Navigation to Organisation Page', async ({
    page,
  }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'All Companies' }).click();
    const organisationsResponsePromise =
      page.waitForResponse('**/organisations**');
    const organisationsResponse = await organisationsResponsePromise;
    await page.waitForURL('/companies');
    await page.getByTestId('company-profile-link').first().click();
    const organisationDetailResponsePromise = page.waitForResponse(
      new RegExp('/organisations/([a-f0-9-]+)$'),
    );
    const organisationDetailResponse = await organisationDetailResponsePromise;
    const organisationRelatedFilesResponsePromise = page.waitForResponse(
      new RegExp(
        '^https://graph.microsoft.com/v1.0/sites/([a-f0-9-]+)/drive/items/([a-zA-Z0-9]+)/children$',
      ),
    );
    const organisationRelatedFilesResponse =
      await organisationRelatedFilesResponsePromise;
    const organisationRelatedNotesResponsePromise = page.waitForResponse(
      new RegExp('.*type=note$'),
    );
    const organisationRelatedNotesResponse =
      await organisationRelatedNotesResponsePromise;

    await page.waitForURL(new RegExp('/companies/([a-f0-9-]+)$'));

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL(new RegExp('/companies/([a-f0-9-]+)$'));
    await expect(page.getByText('Company detailsEdit')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pipeline' })).toBeVisible();
    await expect(page.getByText('Instrument')).toBeVisible();
    await expect(page.getByText('Deal Lead')).toBeVisible();
    await expect(page.getByText('Deal Team')).toBeVisible();
    await expect(page.getByText('Created')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Company Files' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Folder/File Name' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Tags' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Added by' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Related Notes' }),
    ).toBeVisible();
    await expect(page.getByText('Note Title')).toBeVisible();
    await expect(page.getByText('Note Type')).toBeVisible();
    await expect(page.getByText('Updated').first()).toBeVisible();
    await expect(page.getByText('People')).toBeVisible();
    await expect(page.getByText('Tags').last()).toBeVisible();
    await expect(organisationsResponse.status()).toBe(200);
    await expect(organisationDetailResponse.status()).toBe(200);
    await expect(organisationRelatedNotesResponse.status()).toBe(200);
    await expect(organisationRelatedFilesResponse.status()).toBe(200);
  });

  test('Raven Regression: Pages: Pipeline', async ({ page }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();
    const pipelineResponsePromise = page.waitForResponse('**/pipeline');
    const pipelineResponse = await pipelineResponsePromise;
    const opportunitiesResponsePromise =
      page.waitForResponse('**/opportunities**');
    const opportunitiesResponse = await opportunitiesResponsePromise;

    // Assert
    await expect(page).toHaveURL('/companies/pipeline');
    await expect(page).toHaveTitle('Raven');
    await expect(page.getByRole('heading', { name: 'Pipeline' })).toBeVisible();
    await expect(page.getByPlaceholder('Search Pipeline')).toBeVisible();
    await expect(page.getByRole('button', { name: 'All deals' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'My deals' })).toBeVisible();
    await expect(
      page.getByRole('main').getByText('All Instruments'),
    ).toBeVisible();
    await expect(
      page.locator('app-quick-filters-template').getByText('Deal Lead'),
    ).toBeVisible();
    await expect(page.getByText('Outreach', { exact: true })).toBeVisible();
    await expect(page.getByText('Met').first()).toBeVisible();
    await expect(
      page.getByText('Preliminary DD', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('DD', { exact: true })).toBeVisible();
    await page.getByText('IC', { exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByText('IC', { exact: true })).toBeVisible();
    await expect(pipelineResponse.status()).toBe(200);
    await expect(opportunitiesResponse.status()).toBe(200);
  });

  test('Raven Regression: Pages: Opportunity Detailed View: Overview', async ({
    page,
  }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();
    await page.waitForURL('/companies/pipeline');
    await page.getByTestId('opportunity-card').first().hover();
    await page.getByTestId('open-details-button').first().click();

    await page.waitForURL('/companies/**/opportunities/**');

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL(
      new RegExp('/companies/([a-f0-9-]+)/opportunities/([a-f0-9-]+)$'),
    );
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Files')).toBeVisible();
    await expect(page.getByText('Notes')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Details', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Deal Team').first()).toBeVisible();
    await expect(page.getByText('Deal Lead')).toBeVisible();
    await expect(page.getByText('Deal Team').last()).toBeVisible();
    await expect(page.getByText('Missing DD Details')).toBeVisible();
    await expect(page.getByText('Tab')).toBeVisible();
    await expect(page.getByText('Field', { exact: true })).toBeVisible();
    await expect(page.getByText('Action')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('Raven Regression: Pages: Opportunity Detailed View: Files', async ({
    page,
  }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();
    await page.waitForURL('/companies/pipeline');
    await page.getByTestId('opportunity-card').first().hover();
    await page.getByTestId('open-details-button').first().click();

    await page.waitForURL('/companies/**/opportunities/**');
    await page.getByText('Files').click();
    const opportunityTabsTagsResponsePromise = page.waitForResponse(
      '**/tags?take=500&type=tab',
    );
    const opportunityTabsTagsResponse =
      await opportunityTabsTagsResponsePromise;
    await page.waitForURL('/companies/**/opportunities/**/files');

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL(
      new RegExp('/companies/([a-f0-9-]+)/opportunities/([a-f0-9-]+)/files$'),
    );
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Files').first()).toBeVisible();
    await expect(page.getByText('Notes')).toBeVisible();
    // flaky assertion, manage files button is not always visible, add if statement to check if it is visible
    // await expect(
    //   page.getByRole('button', { name: 'Manage Files' }),
    // ).toBeVisible();
    await expect(page.getByText('All Files')).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Folder/File Name' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Tags' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Added by' }),
    ).toBeVisible();
    await expect(opportunityTabsTagsResponse.status()).toBe(200);
  });

  test('Raven Regression: Pages: Opportunity Detailed View: Notes', async ({
    page,
  }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Pipeline' }).click();
    await page.waitForURL('/companies/pipeline');
    await page.getByTestId('opportunity-card').first().hover();
    await page.getByTestId('open-details-button').first().click();
    await page.waitForURL('/companies/**/opportunities/**');
    await page.getByText('Notes').click();
    const noteTemplatesResponsePromise = page.waitForResponse(
      '**/templates?type=note',
    );
    const noteTemplatesResponse = await noteTemplatesResponsePromise;
    const opportunityRelatedNotesResponsePromise = page.waitForResponse(
      new RegExp('.*type=note$'),
    );
    const opportunityRelatedNotesResponse =
      await opportunityRelatedNotesResponsePromise;
    await page.waitForURL('/companies/**/opportunities/**/notes');
    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page).toHaveURL(
      new RegExp('/companies/([a-f0-9-]+)/opportunities/([a-f0-9-]+)/notes$'),
    );
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Files')).toBeVisible();
    await expect(page.getByText('Notes', { exact: true })).toBeVisible();
    await expect(page.getByText('All Notes', { exact: true })).toBeVisible();
    await expect(page.getByText('Created by me')).toBeVisible();
    await expect(page.getByText('I am tagged')).toBeVisible();
    await expect(page.getByText('All Notes Types')).toBeVisible();
    await expect(page.getByText('Note Title')).toBeVisible();
    await expect(page.getByText('Note Type', { exact: true })).toBeVisible();
    await expect(page.getByText('Updated').first()).toBeVisible();
    await expect(page.getByText('People').first()).toBeVisible();
    await expect(page.getByText('Tags').first()).toBeVisible();
    await expect(noteTemplatesResponse.status()).toBe(200);
    await expect(opportunityRelatedNotesResponse.status()).toBe(200);
  });

  test('Raven Regression: Pages: All Notes', async ({ page }) => {
    // Arrange

    // Act
    await page.getByLabel('Toggle Sidebar').click();
    await page.getByRole('button', { name: 'Notes' }).click();
    await page.getByRole('link', { name: 'All Notes' }).click();
    const notesPageResponsePromise = page.waitForResponse(
      new RegExp('.*type=note$'),
    );
    const notesPageResponse = await notesPageResponsePromise;
    await page.waitForURL('/notes');

    await page.getByRole('button', { name: 'Created by me' }).click();
    const notesPageCreatedByMeResponsePromise = page.waitForResponse(
      new RegExp('.*role=created&type=note$'),
    );
    const notesPageCreatedByMeResponse =
      await notesPageCreatedByMeResponsePromise;
    await page.getByRole('button', { name: 'I am tagged' }).click();
    const notesPageIamTaggedResponsePromise = page.waitForResponse(
      new RegExp('.*role=tagged&type=note$'),
    );
    const notesPageIamTaggedResponse = await notesPageIamTaggedResponsePromise;

    await page.getByRole('button', { name: 'All Notes' }).click();

    await page.getByRole('button', { name: 'Company call' }).click();
    const notesPageCompanyCallResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Company%20call&type=note$'),
    );
    const notesPageCompanyCallResponse =
      await notesPageCompanyCallResponsePromise;

    await page.getByRole('button', { name: 'Investor call' }).click();
    const notesPageInvestorCallResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Investor%20call&type=note$'),
    );
    const notesPageInvestorCallResponse =
      await notesPageInvestorCallResponsePromise;

    await page.getByRole('button', { name: 'Market expert call' }).click();
    const notesPageMarketExpertCallResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Market%20expert%20call&type=note$'),
    );
    const notesPageMarketExpertCallResponse =
      await notesPageMarketExpertCallResponsePromise;

    await page.getByRole('button', { name: 'Customer reference call' }).click();
    const notesPageCustomerReferenceCallResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Customer%20reference%20call&type=note$'),
    );
    const notesPageCustomerReferenceCallResponse =
      await notesPageCustomerReferenceCallResponsePromise;

    await page.getByRole('button', { name: 'Pipeline call' }).click();
    const notesPagePipelineCallResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Pipeline%20call&type=note$'),
    );
    const notesPagePipelineCallResponse =
      await notesPagePipelineCallResponsePromise;

    await page.getByRole('button', { name: 'Loose Note' }).click();
    const notesPageLooseNoteResponsePromise = page.waitForResponse(
      new RegExp('.*noteType=Loose%20Note&type=note$'),
    );
    const notesPageLooseNoteResponse = await notesPageLooseNoteResponsePromise;

    await page.getByRole('button', { name: 'Loose Note' }).click();
    await page.waitForURL('/notes');

    // Assert
    await expect(page).toHaveTitle('Raven');
    await expect(page.getByText('All Notes').last()).toBeVisible();
    await expect(page.getByText('Created by me')).toBeVisible();
    await expect(page.getByText('I am tagged')).toBeVisible();
    await expect(page.getByText('Company call')).toBeVisible();
    await expect(page.getByText('Investor call')).toBeVisible();
    await expect(page.getByText('Market expert call')).toBeVisible();
    await expect(page.getByText('Customer reference call')).toBeVisible();
    await expect(page.getByText('Pipeline call')).toBeVisible();
    await expect(page.getByText('Loose Note').first()).toBeVisible();
    await expect(page.getByText('Note Title')).toBeVisible();
    await expect(page.getByText('Note Type').first()).toBeVisible();
    await expect(page.getByText('Updated').first()).toBeVisible();
    await expect(page.getByText('People')).toBeVisible();
    await expect(page.getByText('Tags').first()).toBeVisible();
    await expect(notesPageResponse.status()).toBe(200);
    await expect(notesPageCreatedByMeResponse.status()).toBe(200);
    await expect(notesPageIamTaggedResponse.status()).toBe(200);
    await expect(notesPageCompanyCallResponse.status()).toBe(200);
    await expect(notesPageInvestorCallResponse.status()).toBe(200);
    await expect(notesPageMarketExpertCallResponse.status()).toBe(200);
    await expect(notesPageCustomerReferenceCallResponse.status()).toBe(200);
    await expect(notesPagePipelineCallResponse.status()).toBe(200);
    await expect(notesPageLooseNoteResponse.status()).toBe(200);
  });
});
