// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://raven.test.mubadalacapital.ae',
  adClientId: '88c53dfa-5389-4ee1-a126-0ed17d3a7db4',
  adAuthority:
    'https://login.microsoftonline.com/9e89d976-bede-4fef-88b6-5d6b2aea2e02',
  adRedirectUri: 'http://localhost:4200',
  adPostLogoutRedirectUri: 'http://localhost:4200/login',
  adScope: 'https://raven.test.mubadalacapital.ae/api',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
