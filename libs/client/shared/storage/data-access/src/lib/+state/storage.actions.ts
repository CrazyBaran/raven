import { createActionGroup, props } from '@ngrx/store';

import { AzureImageEntity } from './storage.models';

export const StorageActions = createActionGroup({
  source: 'Storage/API',
  events: {
    'Add Images': props<{ images: AzureImageEntity[] }>(),
  },
});
