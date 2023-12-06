import { File } from '@app/client/files/feature/data-access';
import {} from '@microsoft/microsoft-graph-types';
export type FileEntity = File & {
  folderId?: string;
};
