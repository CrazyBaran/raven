import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { StorageActions } from './storage.actions';
import { AzureImageEntity } from './storage.models';

export type AzureImagesState = EntityState<AzureImageEntity>;

export interface StorageState {
  images: AzureImagesState;
}

export const azureImageAdapter: EntityAdapter<AzureImageEntity> =
  createEntityAdapter<AzureImageEntity>({
    selectId: (image) => image.fileName,
  });

export const initialStorageState: StorageState = {
  images: azureImageAdapter.getInitialState(),
};
export const storageFeature = createFeature({
  name: 'storage',
  reducer: createReducer(
    initialStorageState,
    on(StorageActions.addImages, (state, { images }) => ({
      ...state,
      images: azureImageAdapter.upsertMany(images, state.images),
    })),
  ),
});
