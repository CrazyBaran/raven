import { inject } from '@angular/core';

import { FilesService } from '@app/client/files/feature/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FilesActions } from './files.actions';

export const loadFiles = createEffect(
  (actions$ = inject(Actions), filesService = inject(FilesService)) => {
    return actions$.pipe(
      ofType(FilesActions.getFiles),
      switchMap((action) =>
        filesService.getFiles(action).pipe(
          map((response) => {
            return FilesActions.getFilesSuccess({
              data: response?.value || [],
              folderId: action.folderId,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              FilesActions.getFilesFailure({
                error,
                folderId: action.folderId,
              }),
            );
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const loadFilesByTags = createEffect(
  (actions$ = inject(Actions), filesService = inject(FilesService)) => {
    return actions$.pipe(
      ofType(FilesActions.getFilesByTags),
      switchMap((action) =>
        filesService.getFilesByTags(action).pipe(
          map((response) => {
            return FilesActions.getFilesByTagsSuccess({
              opportunityId: action.opportunityId,
              tags: action.tags,
              data: response || [],
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              FilesActions.getFilesByTagsFailure({
                error,
              }),
            );
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const updateFile = createEffect(
  (actions$ = inject(Actions), filesService = inject(FilesService)) => {
    return actions$.pipe(
      ofType(FilesActions.updateFileTags),
      switchMap((action) =>
        filesService.updateFileTags(action).pipe(
          switchMap((response) => {
            return [
              FilesActions.updateFileTagsSuccess({
                data: response.data!,
              }),
              NotificationsActions.showSuccessNotification({
                content: 'File tags updated successfully',
              }),
            ];
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              FilesActions.updateFileTagsFailure({ error }),
              NotificationsActions.showErrorNotification({
                content: 'File tags update failed',
              }),
            );
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const copyFile = createEffect(
  (actions$ = inject(Actions), filesService = inject(FilesService)) => {
    return actions$.pipe(
      ofType(FilesActions.copyFile),
      switchMap(({ siteId, itemId, parentReference }) =>
        filesService.copyFile(siteId, itemId, { parentReference }).pipe(
          map((response) => {
            return FilesActions.copyFileSuccess({
              data: [], //todo: response?.value || [],
              folderId: 'Root',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              FilesActions.copyFileFailure({
                error,
                folderId: 'Root',
              }),
            );
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);
