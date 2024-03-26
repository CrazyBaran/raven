/* eslint-disable @nx/enforce-module-boundaries */
import { computed, inject } from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';
import { File, FilesService } from '@app/client/files/feature/data-access';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type RelatedFilesState = {
  directoryUrl: string;
  currentTab: string;
  fileTagDictionary: Record<string, { name: string }[]>;
  files: File[];
  loading: boolean;
};

export const relatedFilesStore = signalStore(
  withState<RelatedFilesState>({
    directoryUrl: '',
    currentTab: '',
    files: [],
    fileTagDictionary: {},
    loading: false,
  }),
  withComputed(({ files, fileTagDictionary, currentTab }) => ({
    tableData: computed(() => {
      return files().filter(
        (file) =>
          file.file &&
          fileTagDictionary()[file.id!].some(
            (tag) => tag.name === currentTab(),
          ),
      );
    }),
  })),
  withMethods(
    (
      store,
      filesService = inject(FilesService),
      environment = inject(ENVIRONMENT),
    ) => ({
      setDirectoryUrl: rxMethod<string>(
        tap((directoryUrl) => patchState(store, { directoryUrl })),
      ),
      setCurrentTab: rxMethod<string>(
        tap((currentTab) => patchState(store, { currentTab })),
      ),
      setFileTagDictionary: rxMethod<Record<string, { name: string }[]>>(
        tap((fileTagDictionary) => patchState(store, { fileTagDictionary })),
      ),
      loadAllFiles: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((directoryUrl) =>
            filesService
              .getFilesRecursive(directoryUrl, environment.sharepointSiteId)
              .pipe(
                tapResponse({
                  next: (files) => {
                    patchState(store, { files });
                  },
                  error: console.error,
                  finalize: () => patchState(store, { loading: false }),
                }),
              ),
          ),
        ),
      ),
    }),
  ),
);
