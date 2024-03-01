export const featureFlags = ['shortlistsFeature', 'remindersFeature'] as const;
export type FeatureFlag = (typeof featureFlags)[number];

export type Environment = {
  production: boolean;
  apiUrl: string;
  adClientId: string;
  adAuthority: string;
  adRedirectUri: string;
  adPostLogoutRedirectUri: string;
  adScope: string;
  sharepointRoot: string;
  sharepointSiteId: string;
  sharepointDriveId: string;
  sharepointRootDirectoryId: string;
  sharepointWeb: string;
  sharepointList: string;
  websocketUrl: string;
} & Record<FeatureFlag, boolean>;
