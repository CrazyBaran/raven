// import { inject } from '@angular/core';
// import { NotificationsActions } from '@app/client/shared/util-notifications';
// import { TagsService } from '@app/client/tags/data-access';
// import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import * as _ from 'lodash';
// import { catchError, filter, forkJoin, map, of, switchMap } from 'rxjs';
// import { StorageActions } from './storage.actions';
// import { tagsFeature } from './tags.reducer';
//
// export const loadTags = createEffect(
//   (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
//     return actions$.pipe(
//       ofType(StorageActions.getTags),
//       switchMap(() =>
//         tagsService.getTags().pipe(
//           map((response) => {
//             return StorageActions.getTagsSuccess({ data: response.data || [] });
//           }),
//           catchError((error) => {
//             console.error('Error', error);
//             return of(StorageActions.getTagsFailure({ error }));
//           }),
//         ),
//       ),
//     );
//   },
//   {
//     functional: true,
//   },
// );
//
// export const getTagsByTypeIfNotLoaded = createEffect(
//   (actions$ = inject(Actions), store = inject(Store)) => {
//     return actions$.pipe(
//       ofType(StorageActions.getTagsByTypesIfNotLoaded),
//       concatLatestFrom(() => store.select(tagsFeature.selectLoadedTags)),
//       map(([{ tagTypes }, loadedTagTypes]) =>
//         tagTypes.filter((tagType) => !loadedTagTypes[tagType]),
//       ),
//       filter((tagTypes) => tagTypes.length > 0),
//       map((tagTypes) => StorageActions.getTagsByTypes({ tagTypes: tagTypes })),
//     );
//   },
//   {
//     functional: true,
//   },
// );
//
// export const getTagsByTypes = createEffect(
//   (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
//     return actions$.pipe(
//       ofType(StorageActions.getTagsByTypes),
//       switchMap(({ tagTypes }) =>
//         forkJoin(tagTypes.map((type) => tagsService.getTags({ type }))).pipe(
//           map((responses) => {
//             return StorageActions.getTagsByTypesSuccess({
//               data: _.flatten(responses.map((response) => response.data || [])),
//               tagTypes,
//             });
//           }),
//           catchError((error) => {
//             console.error('Error', error);
//             return of(
//               StorageActions.getTagsByTypesFailure({ error, tagTypes }),
//             );
//           }),
//         ),
//       ),
//     );
//   },
//   {
//     functional: true,
//   },
// );
//
// export const createTag = createEffect(
//   (actions$ = inject(Actions), tagsService = inject(TagsService)) => {
//     return actions$.pipe(
//       ofType(StorageActions.createTag),
//       switchMap((action) =>
//         tagsService.createTag(action.data).pipe(
//           switchMap((response) => {
//             return [
//               NotificationsActions.showSuccessNotification({
//                 content: 'Tag Created.',
//               }),
//               StorageActions.createTagSuccess({ data: response.data! }),
//             ];
//           }),
//           catchError((error) => {
//             console.error('Error', error);
//             return of(StorageActions.createTagFailure({ error }));
//           }),
//         ),
//       ),
//     );
//   },
//   {
//     functional: true,
//   },
// );
