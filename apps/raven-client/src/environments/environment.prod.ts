import { Environment } from '@app/client/core/environment';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://raven-staging-api.mubadalacapital.ae',
  adClientId: 'fc392811-e450-47c1-8928-0ac8def0bb9e',
  adAuthority:
    'https://login.microsoftonline.com/c22477b0-4838-4110-8b5c-72e85395fab5',
  adRedirectUri: 'https://raven-staging.mubadalacapital.ae',
  adPostLogoutRedirectUri: 'https://raven-staging.mubadalacapital.ae/login',
  adScope: 'https://raven-staging.mubadalacapital.ae/api',
  sharepointRoot: 'https://onemubadalauk.sharepoint.com/',
  sharepointWeb: 'sites/raven-staging',
  sharepointList: 'Shared Documents',
  sharepointSiteId: '325059e4-46bb-498d-a260-98f7cb8d2dfb',
  sharepointDriveId:
    'b!5FlQMrtGjUmiYJj3y40t--qau7WP-uRBqy0COkR9--xujk9FQtU_ToCpw10tbcQJ',
  sharepointRootDirectoryId: '01TMG4F3ZIOUZNA6XIYNCLU6GK7VG3EYMV',
  websocketUrl: 'https://app-raven-prod-uks.azurewebsites.net/',
  shortlistsFeature: true,
  remindersFeature: true,
  organisationLayout: false,
};
