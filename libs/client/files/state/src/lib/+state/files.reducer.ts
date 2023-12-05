import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { FilesActions } from './files.actions';
import { FileEntity } from './files.model';

export interface FilesState extends EntityState<FileEntity> {
  loading: boolean;
}

export const fileAdapter: EntityAdapter<FileEntity> =
  createEntityAdapter<FileEntity>();

export const initialFileState: FilesState = fileAdapter.getInitialState({
  loading: false,
});

export const filesFeature = createFeature({
  name: 'files',
  reducer: createReducer(
    initialFileState,
    on(FilesActions.getFiles, (state) => ({
      ...state,
      loading: true,
    })),
    on(FilesActions.getFilesSuccess, (state, { data }) =>
      fileAdapter.upsertMany([...data], { ...state, loading: false }),
    ),
    on(FilesActions.getFilesFailure, (state) => ({
      ...state,
      loading: false,
    })),
  ),
  extraSelectors: ({ selectFilesState }) => ({
    ...fileAdapter.getSelectors(selectFilesState),
  }),
});
