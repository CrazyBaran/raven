import { FileData } from '@app/rvns-files';
import { createActionGroup, props } from '@ngrx/store';
import { FileEntity } from './files.model';

export const FilesActions = createActionGroup({
  source: 'Files/API',
  events: {
    'Get Files': props<{ directoryUrl: string; folderId: string }>(),
    'Get Files Success': props<{ data: FileEntity[]; folderId: string }>(),
    'Get Files Failure': props<{ error: string; folderId: string }>(),

    'Update File Tags': props<{
      id: string;
      tags: string[];
      opportunityId: string;
    }>(),
    'Update File Tags Success': props<{ data?: FileData }>(),
    'Update File Tags Failure': props<{ error: string }>(),

    'Copy File': props<{
      folderId: string;
      siteId: string;
      itemId: string;
      parentReference: { driveId: string; id: string };
    }>(),
    'Copy File Success': props<{ data: FileEntity[]; folderId: string }>(),
    'Copy File Failure': props<{ error: string; folderId: string }>(),
  },
});
