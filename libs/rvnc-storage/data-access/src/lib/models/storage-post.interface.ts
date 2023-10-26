export interface StoragePost {
  fileName: string;
  permission: 'write' | 'read';
  noteRootVersionId: string;
}
