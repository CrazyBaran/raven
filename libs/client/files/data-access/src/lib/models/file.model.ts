export interface File {
  '@microsoft.graph.downloadUrl': string;
  createdDateTime: string;
  eTag: string;
  id: string;
  lastModifiedDateTime: string;
  name: string;
  webUrl: string;
  cTag: string;
  size: number;
  createdBy: CreatedBy;
  lastModifiedBy: LastModifiedBy;
  parentReference: ParentReference;
  file: File;
  fileSystemInfo: FileSystemInfo;
  shared: Shared;
}

export interface CreatedBy {
  user: User;
}

export interface User {
  email: string;
  id: string;
  displayName: string;
}

export interface LastModifiedBy {
  user: User2;
}

export interface User2 {
  email: string;
  id: string;
  displayName: string;
}

export interface ParentReference {
  driveType: string;
  driveId: string;
  id: string;
  name: string;
  path: string;
  siteId: string;
}

export interface File {
  mimeType: string;
  hashes: Hashes;
}

export interface Hashes {
  quickXorHash: string;
}

export interface FileSystemInfo {
  createdDateTime: string;
  lastModifiedDateTime: string;
}

export interface Shared {
  scope: string;
}
