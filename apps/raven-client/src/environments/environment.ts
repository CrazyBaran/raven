// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '@app/client/core/environment';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api',
  adClientId: '88c53dfa-5389-4ee1-a126-0ed17d3a7db4',
  adAuthority:
    'https://login.microsoftonline.com/9e89d976-bede-4fef-88b6-5d6b2aea2e02',
  adRedirectUri: 'http://localhost:4200',
  adPostLogoutRedirectUri: 'http://localhost:4200/login',
  adScope: 'https://raven.test.mubadalacapital.ae/api',
  sharepointRoot: 'https://testonemubadala.sharepoint.com/',
  sharepointWeb: 'sites/mctestraven',
  sharepointList: 'Shared Documents',
  sharepointSiteId: '474b0b44-ccfa-4e1d-aae8-41e54af7c32c',
  sharepointDriveId:
    'b!RAtLR_rMHU6q6EHlSvfDLAASJHjBXgVDjdZqm3u-M8xaIH4wn66DSb1tnKWcYlEx',
  sharepointRootDirectoryId: '01RVXLZIUM2GLOT2SNUZDZBGFRP3ZBORTK',
  // websocketUrl: 'https://as-wa-mc-raven-dev.azurewebsites.net/',
  websocketUrl: 'http://localhost:3333',
  shortlistsFeature: true,
  remindersFeature: true,
  organisationLayout: true,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
