import { Environment } from '@app/client/core/environment';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://raven.test.mubadalacapital.ae',
  adClientId: '88c53dfa-5389-4ee1-a126-0ed17d3a7db4',
  adAuthority:
    'https://login.microsoftonline.com/9e89d976-bede-4fef-88b6-5d6b2aea2e02',
  adRedirectUri: 'https://raven-static.test.mubadalacapital.ae',
  adPostLogoutRedirectUri: 'https://raven-static.test.mubadalacapital.ae/login',
  adScope: 'https://raven.test.mubadalacapital.ae/api',
  sharepointRoot: 'https://testonemubadala.sharepoint.com/',
  sharepointWeb: 'sites/mctestraven',
  sharepointList: 'Shared Documents',
  sharepointSiteId: '474b0b44-ccfa-4e1d-aae8-41e54af7c32c',
  sharepointDriveId:
    'b!RAtLR_rMHU6q6EHlSvfDLAASJHjBXgVDjdZqm3u-M8xaIH4wn66DSb1tnKWcYlEx',
  sharepointRootDirectoryId: '01RVXLZIUM2GLOT2SNUZDZBGFRP3ZBORTK',
  websocketUrl: 'https://as-wa-mc-raven-dev.azurewebsites.net/',
  shortlistsFeature: true,
};
