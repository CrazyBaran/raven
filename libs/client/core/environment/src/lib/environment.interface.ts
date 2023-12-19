export interface Environment {
  production: boolean;
  apiUrl: string;
  adClientId: string;
  adAuthority: string;
  adRedirectUri: string;
  adPostLogoutRedirectUri: string;
  sharepointRoot: string;
  sharepointPath: string;
  sharepointSiteId: string;
  sharepointDriveId: string;
  sharepointRootDirectoryId: string;
}
