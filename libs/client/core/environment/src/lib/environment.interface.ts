export interface Environment {
  production: boolean;
  apiUrl: string;
  adClientId: string;
  adAuthority: string;
  adRedirectUri: string;
  adPostLogoutRedirectUri: string;
}
