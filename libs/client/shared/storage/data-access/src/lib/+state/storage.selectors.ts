import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AzureImagesState,
  StorageState,
  azureImageAdapter,
  storageFeature,
} from './storage.reducer';

const { selectEntities } = azureImageAdapter.getSelectors();

const selectStorageState = createFeatureSelector<StorageState>(
  storageFeature.name,
);

const selectAzureImageState = createSelector(
  selectStorageState,
  (state) => state.images ?? {},
);

const selectAzureImageDictionary = createSelector(
  selectAzureImageState,
  (state: AzureImagesState) => selectEntities(state) ?? {},
);

export const storageQuery = {
  selectAzureImageDictionary,
};
