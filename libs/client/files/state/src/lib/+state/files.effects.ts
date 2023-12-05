import { inject } from '@angular/core';

import { FilesService } from '@app/client/files/feature/data-access';
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
