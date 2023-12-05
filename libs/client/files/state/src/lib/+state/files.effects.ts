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
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(FilesActions.getFilesFailure({ error }));
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
                data: response.data,
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
