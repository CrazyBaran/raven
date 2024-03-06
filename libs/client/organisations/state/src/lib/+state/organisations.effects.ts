import { inject } from '@angular/core';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  concatMap,
  filter,
  map,
  of,
  switchMap,
} from 'rxjs';
import { organisationsFeature } from '../../index';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from './organisations.actions';
import { organisationsQuery } from './organisations.selectors';

export const loadOrganisationOnUrlEvent = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsUrlActions.queryParamsChanged),
      switchMap(({ params }) =>
        organisationsService.getOrganisations(params).pipe(
          switchMap((response) => {
            return [
              OrganisationsActions.getOrganisationsSuccess({
                data: response.data || { items: [], total: 0 },
              }),
              OrganisationsUrlActions.fetchedTableItems({
                ids:
                  response.data?.items.map((d) => d.id!).filter(Boolean) || [],
              }),
            ];
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(OrganisationsActions.getOrganisationsFailure({ error }));
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const loadOrganisation = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.getOrganisation),
      switchMap(({ id }) =>
        organisationsService.getOrganisation(id ?? '').pipe(
          map((response) => {
            return OrganisationsActions.getOrganisationSuccess({
              data: response.data,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(OrganisationsActions.getOrganisationFailure({ error }));
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const loadOrganisations = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.getOrganisations),
      switchMap(() =>
        organisationsService.getOrganisations().pipe(
          map((response) => {
            return OrganisationsActions.getOrganisationsSuccess({
              data: response.data || { items: [], total: 0 },
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(OrganisationsActions.getOrganisationsFailure({ error }));
          }),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const loadMoreOrganisations = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.loadMoreOrganisations),
      concatMap(({ params }) =>
        organisationsService.getOrganisations(params).pipe(
          map((response) => {
            return OrganisationsActions.loadMoreOrganisationsSuccess({
              data: response.data || { items: [], total: 0 },
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              OrganisationsActions.loadMoreOrganisationsFailure({ error }),
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

export const createOrganisation = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.createOrganisation),
      switchMap((action) =>
        organisationsService.createOrganisation(action.data).pipe(
          map((response) => {
            return OrganisationsActions.createOrganisationSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              OrganisationsActions.createOrganisationFailure({ error }),
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

export const updateOrganisation$ = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.updateOrganisation),
      switchMap(({ id, changes }) =>
        organisationsService.patchOrganisation(id, changes).pipe(
          switchMap(({ data }) => [
            OrganisationsActions.updateOrganisationSuccess({
              data: data!,
            }),
            NotificationsActions.showSuccessNotification({
              content: 'Organisation changed.',
            }),
          ]),
          catchError((error) =>
            of(
              OrganisationsActions.updateOrganisationFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);

export const getDataWarehouseLastUpdated = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.getDataWarehouseLastUpdated),
      switchMap(() =>
        organisationsService.getDataWarehouseLastUpdated().pipe(
          map((response) => {
            return OrganisationsActions.getDataWarehouseLastUpdatedSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              OrganisationsActions.getDataWarehouseLastUpdatedFailure({
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

export const getDataWarehouseLastUpdatedIfNotLoaded = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OrganisationsActions.getDataWarehouseLastUpdatedIfNotLoaded),
      concatLatestFrom(() =>
        store.select(organisationsFeature.selectDataWarehouseLastUpdated),
      ),
      filter(([, lastUpdated]) => !lastUpdated),
      map(() => OrganisationsActions.getDataWarehouseLastUpdated()),
    );
  },
  {
    functional: true,
  },
);

export const createOrganisationSharepointFolder = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.createOrganisationSharepointFolder),
      switchMap((action) =>
        organisationsService.createOrganisationSharepointFolder(action.id).pipe(
          switchMap(() => organisationsService.getOrganisation(action.id)),
          map((response) => {
            return OrganisationsActions.createOrganisationSharepointFolderSuccess(
              {
                data: response.data!,
              },
            );
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              OrganisationsActions.createOrganisationSharepointFolderFailure({
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

export const refreshOrganisations = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        OrganisationsActions.refreshOrganisations,
        ShortlistsActions.bulkAddOrganisationsToShortlistSuccess,
        ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
      ),
      concatLatestFrom(() =>
        combineLatest({
          params: store.select(
            organisationsQuery.selectOrganisationsTableParams,
          ),
          table: store.select(organisationsQuery.selectTable),
        }),
      ),
      switchMap(([_, { params, table }]) =>
        organisationsService
          .getOrganisations({
            ...params,
            take: table?.ids.length || 0,
          })
          .pipe(
            map((response) => {
              return OrganisationsActions.refreshOrganisationsSuccess({
                data: response.data || { items: [], total: 0 },
              });
            }),
            catchError((error) => {
              console.error('Error', error);
              return of(
                OrganisationsActions.refreshOrganisationsFailure({ error }),
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
