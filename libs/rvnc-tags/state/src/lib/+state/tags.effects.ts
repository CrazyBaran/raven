import { inject } from '@angular/core';
import { TagsService } from '@app/rvnc-tags/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TagsActions } from './tags.actions';

export const loadTags = createEffect(
  (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
    return actions$.pipe(
      ofType(TagsActions.getTags),
      switchMap(() =>
        tagsService.getNotes().pipe(
          map((response) => {
            return TagsActions.getTagsSuccess({ data: response.data || [] });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(TagsActions.getTagsFailure({ error }));
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const createTag = createEffect(
  (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
    return actions$.pipe(
      ofType(TagsActions.createTag),
      switchMap((action) =>
        tagsService.createTag(action.data).pipe(
          map((response) => {
            return TagsActions.createTagSuccess({ data: response.data! });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(TagsActions.createTagFailure({ error }));
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);
