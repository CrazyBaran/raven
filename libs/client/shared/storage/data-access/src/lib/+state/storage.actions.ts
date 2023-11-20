import { createActionGroup, props } from '@ngrx/store';
import { AzureImageEntity } from './storage.reducer';

export const StorageActions = createActionGroup({
  source: 'Storage/API',
  events: {
    'Add Images': props<{ images: AzureImageEntity[] }>(),
  },
});
