/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { LoadingState } from '@app/client/shared/util';
import { TagData } from '@app/rvns-tags';
import { FilesActions } from './files.actions';
import { FileEntity } from './files.model';

export interface FilesState extends EntityState<FileEntity> {
  loadedFolders: Record<string, boolean | undefined>;
  filesTags: Record<string, TagData[]>;
  loadingStates: LoadingState<'updateTags'>;
  filteredFilesByTags: Record<string, FileEntity[]>;
}

export const fileAdapter: EntityAdapter<FileEntity> =
  createEntityAdapter<FileEntity>();

export const initialFileState: FilesState = fileAdapter.getInitialState({
  loadedFolders: {},
  filesTags: {},
  loadingStates: {},
  filteredFilesByTags: {},
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
        filesTags: {
          ...state.filesTags,
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

    on(FilesActions.updateFileTags, (state, { id }) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        updateTags: true,
      },
    })),
    on(FilesActions.updateFileTagsSuccess, (state, { data }) => ({
      ...state,
      filesTags: {
        ...state.filesTags,
        [data!.internalSharepointId]: data?.tags ?? [],
      },
      loadingStates: {
        ...state.loadingStates,
        updateTags: false,
      },
    })),
    on(FilesActions.updateFileTagsFailure, (state) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        updateTags: false,
      },
    })),
    on(
      FilesActions.getFilesByTagsSuccess,
      (state, { data, tags, opportunityId }) => ({
        ...state,
        filteredFilesByTags: {
          ...state.filteredFilesByTags,
          [opportunityId + tags[0]]: data,
        },
      }),
    ),
  ),
  extraSelectors: ({ selectFilesState, selectFilesTags }) => ({
    ...fileAdapter.getSelectors(selectFilesState),
    selectFileTags: (id: string) =>
      createSelector(selectFilesTags, (tags) => tags[id] ?? []),
  }),
});
