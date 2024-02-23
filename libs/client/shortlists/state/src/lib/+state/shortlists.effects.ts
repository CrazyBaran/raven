import { inject } from '@angular/core';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ShortlistsActions } from './shortlists.actions';
import { shortlistsQuery } from './shortlists.selectors';

export const getShortlists$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.getShortlists),
      switchMap(({ query }) =>
        shortlistsService.getShortlists(query).pipe(
          map((response) => {
            return ShortlistsActions.getShortlistsSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.getShortlistsFailure({
                error,
                message: 'Get Shortlists Failed.',
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

export const loadMoreShortlists$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.loadMoreShortlists),
      switchMap(({ query }) =>
        shortlistsService.getShortlists(query).pipe(
          map((response) => {
            return ShortlistsActions.loadMoreShortlistsSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.loadMoreShortlistsFailure({
                error,
                message: 'Load More Shortlists Failed.',
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

export const getShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.getShortlist),
      switchMap(({ id }) =>
        shortlistsService.getShortlist(id).pipe(
          map((response) => {
            return ShortlistsActions.getShortlistSuccess({
              data: {
                ...response.data!,
                contibutors: [
                  {
                    id: '1',
                    name: 'John Doe 12345',
                  },
                  {
                    id: '2',
                    name: 'Jane Doe 12345',
                  },
                  {
                    id: '3',
                    name: 'John Smith 12345',
                  },
                  {
                    id: '4',
                    name: 'Jane Smith 12345',
                  },
                  {
                    id: '5',
                    name: 'John Smith 12345',
                  },
                  {
                    id: '6',
                    name: 'Jane Smith 12345',
                  },
                  {
                    id: '7',
                    name: 'John Smith 12345',
                  },
                  {
                    id: '8',
                    name: 'Jane Smith 12345',
                  },
                ],
              },
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.getShortlistFailure({
                error,
                message: 'Get Shortlist Failed.',
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

export const getShortlistIfNotLoaded$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(ShortlistsActions.getShorlistIfNotLoaded),
      concatLatestFrom(() => store.select(shortlistsQuery.selectEntities)),
      filter(([{ id }, entities]) => !entities[id]),
      map(([{ id }]) => ShortlistsActions.getShortlist({ id })),
    );
  },
  {
    functional: true,
  },
);

export const deleteShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.deleteShortlist),
      switchMap(({ id }) =>
        shortlistsService.deleteShortlist(id).pipe(
          map(() => {
            return ShortlistsActions.deleteShortlistSuccess({
              data: { id },
              message: 'Shortlist Deleted.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.deleteShortlistFailure({
                error,
                message: 'Delete Shortlist Failed.',
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

export const updateShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.updateShortlist),
      switchMap(({ id, changes }) =>
        shortlistsService.updateShortlist(id, changes).pipe(
          map((response) => {
            return ShortlistsActions.updateShortlistSuccess({
              data: response.data!,
              message: 'Shortlist Updated.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.updateShortlistFailure({
                error,
                message: 'Update Shortlist Failed.',
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

export const createShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.createShortlist),
      switchMap(({ data }) =>
        shortlistsService.createShortlist(data).pipe(
          map((response) => {
            return ShortlistsActions.createShortlistSuccess({
              data: response.data!,
              message: 'Shortlist Created.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.createShortlistFailure({
                error,
                message: 'Create Shortlist Failed.',
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

export const bulkAddOrganisationsToShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.bulkAddOrganisationsToShortlist),
      switchMap(({ data }) =>
        shortlistsService.bulkAddOrganisationsToShortlist(data).pipe(
          map(() => {
            return ShortlistsActions.bulkAddOrganisationsToShortlistSuccess({
              data,
              message: 'Bulk Add Organisations To Shortlist.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.bulkAddOrganisationsToShortlistFailure({
                error,
                message: 'Bulk Add Organisations To Shortlist Failed.',
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

export const bulkRemoveOrganisationsFromShortlist$ = createEffect(
  (
    actions$ = inject(Actions),
    shortlistsService = inject(ShortlistsService),
  ) => {
    return actions$.pipe(
      ofType(ShortlistsActions.bulkRemoveOrganisationsFromShortlist),
      switchMap(({ data }) =>
        shortlistsService.bulkRemoveOrganisationsFromShortlist(data).pipe(
          map(() => {
            return ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess(
              {
                data,
                message: 'Bulk Remove Organisations From Shortlist.',
              },
            );
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              ShortlistsActions.bulkRemoveOrganisationsFromShortlistFailure({
                error,
                message: 'Bulk Remove Organisations From Shortlist Failed.',
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

export const showShortlistSuccessMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        ShortlistsActions.deleteShortlistSuccess,
        ShortlistsActions.updateShortlistSuccess,
        ShortlistsActions.createShortlistSuccess,
        ShortlistsActions.bulkAddOrganisationsToShortlistSuccess,
        ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
      ),
      filter(({ message }) => !!message),
      map(({ message }) => {
        return NotificationsActions.showSuccessNotification({
          content: message!,
        });
      }),
    );
  },
  {
    functional: true,
  },
);

export const showShortlistErrorMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        ShortlistsActions.getShortlistsFailure,
        ShortlistsActions.getShortlistFailure,
        ShortlistsActions.deleteShortlistFailure,
        ShortlistsActions.updateShortlistFailure,
        ShortlistsActions.createShortlistFailure,
        ShortlistsActions.bulkAddOrganisationsToShortlistFailure,
        ShortlistsActions.bulkRemoveOrganisationsFromShortlistFailure,
      ),
      filter(({ message }) => !!message),
      map(({ message }) => {
        return NotificationsActions.showErrorNotification({
          content: message!,
        });
      }),
    );
  },
  {
    functional: true,
  },
);
