import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { TagData } from '@app/rvns-tags';
import { FilesActions } from './files.actions';
import { FileEntity } from './files.model';

export interface FilesState extends EntityState<FileEntity> {
  loadedFolders: Record<string, boolean | undefined>;
  fileTags: Record<string, TagData[]>;
}

export const fileAdapter: EntityAdapter<FileEntity> =
  createEntityAdapter<FileEntity>();

export const initialFileState: FilesState = fileAdapter.getInitialState({
  loadedFolders: {},
  fileTags: {},
});

export const filesFeature = createFeature({
  name: 'files',
  reducer: createReducer(
    initialFileState,
    on(FilesActions.getFiles, (state, { folderId }) => ({
      ...state,
      loadedFolders: {
        ...state.loadedFolders,
        [folderId]: false,
      },
    })),
    on(FilesActions.getFilesSuccess, (state, { data, folderId: folderId }) =>
      fileAdapter.upsertMany(
        [
          ...data.map((f) => ({
            ...f,
            folderId: folderId,
          })),
        ],
        {
          ...state,
          loadedFolders: {
            ...state.loadedFolders,
            [folderId]: true,
          },
        },
      ),
    ),
    on(FilesActions.getFilesFailure, (state, { folderId }) => ({
      ...state,
      loadedFolders: {
        ...state.loadedFolders,
        [folderId]: true,
      },
    })),
    on(
      OpportunitiesActions.getOpportunityDetailsSuccess,
      (state, { data }) => ({
        ...state,
        fileTags: {
          ...state.fileTags,
          ...(data?.files?.reduce(
            (acc, file) => {
              acc[file.internalSharepointId] = file.tags ?? [];
              return acc;
            },
            {} as Record<string, TagData[]>,
          ) ?? {}),
        },
      }),
    ),
    on(FilesActions.updateFileTagsSuccess, (state, { data }) => ({
      ...state,
      fileTags: {
        ...state.fileTags,
        [data!.internalSharepointId]: data?.tags ?? [],
      },
    })),
  ),
  extraSelectors: ({ selectFilesState }) => ({
    ...fileAdapter.getSelectors(selectFilesState),
  }),
});
