import { inject } from '@angular/core';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagsService } from '@app/client/tags/data-access';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import {
  catchError,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { TagsActions } from './tags.actions';
import { tagsFeature } from './tags.reducer';
import { tagsQuery } from './tags.selectors';

export const loadTags = createEffect(
  (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
    return actions$.pipe(
      ofType(TagsActions.getTags),
      switchMap(() =>
        tagsService.getTags().pipe(
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

export const getTagsByTypeIfNotLoaded = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(TagsActions.getTagsByTypesIfNotLoaded),
      concatLatestFrom(() => store.select(tagsFeature.selectLoadedTags)),
      map(([{ tagTypes }, loadedTagTypes]) =>
        tagTypes.filter((tagType) => !loadedTagTypes[tagType]),
      ),
      filter((tagTypes) => tagTypes.length > 0),
      map((tagTypes) => TagsActions.getTagsByTypes({ tagTypes: tagTypes })),
    );
  },
  {
    functional: true,
  },
);

export const getTagsByTypes = createEffect(
  (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
    return actions$.pipe(
      ofType(TagsActions.getTagsByTypes),
      mergeMap(({ tagTypes }) =>
        forkJoin(tagTypes.map((type) => tagsService.getTags({ type }))).pipe(
          map((responses) => {
            return TagsActions.getTagsByTypesSuccess({
              data: _.flatten(responses.map((response) => response.data || [])),
              tagTypes,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(TagsActions.getTagsByTypesFailure({ error, tagTypes }));
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
          switchMap((response) => {
            return [
              NotificationsActions.showSuccessNotification({
                content: 'Tag Created.',
              }),
              TagsActions.createTagSuccess({ data: response.data! }),
            ];
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              TagsActions.createTagFailure({ error }),
              NotificationsActions.showErrorNotification({
                content: 'Tag Creation Failed.',
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

export const getTagByOrganisationIdIfNotLoaded = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    tagsService = inject(TagsService),
  ) => {
    return actions$.pipe(
      ofType(TagsActions.getTagByOrganisationIdIfNotLoaded),
      concatLatestFrom((action) =>
        store.select(
          tagsQuery.selectTagsByOrganisationId(action.organisationId),
        ),
      ),
      filter(([, tags]) => !tags.filter((t) => t?.type === 'company')?.length),
      switchMap(([{ organisationId }]) =>
        tagsService
          .getTags({
            organisationId,
          })
          .pipe(
            map((response) => {
              return TagsActions.getTagByOrganisationIdIfNotLoadedSuccess({
                data: response.data || [],
              });
            }),
            catchError((error) => {
              console.error('Error', error);
              return of(
                TagsActions.getTagByOrganisationIdIfNotLoadedFailure({ error }),
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
