import { createActionGroup, props } from '@ngrx/store';
import { FileEntity } from './files.model';

export const FilesActions = createActionGroup({
  source: 'Files/API',
  events: {
    'Get Files': props<{ directoryUrl: string }>(),
    'Get Files Success': props<{ data: FileEntity[] }>(),
    'Get Files Failure': props<{ error: string }>(),

    'Update File Tags': props<{
      id: string;
      tags: string[];
      opportunityId: string;
    }>(),
    'Update File Tags Success': props<{ data?: FileEntity }>(),
    'Update File Tags Failure': props<{ error: string }>(),
  },
});
