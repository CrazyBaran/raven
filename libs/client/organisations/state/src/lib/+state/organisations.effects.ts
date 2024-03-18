import { inject } from '@angular/core';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
          catchError((error) =>
            of(
              OrganisationsActions.getOrganisationsFailure({
                error,
                message: 'Failed to load organisations',
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
          catchError((error) =>
            of(
              OrganisationsActions.getOrganisationFailure({
                error,
                message: 'Failed to load organisation',
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
          catchError((error) =>
            of(
              OrganisationsActions.getOrganisationsFailure({
                error,
                message: 'Failed to load organisations',
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
          catchError((error) =>
            of(
              OrganisationsActions.loadMoreOrganisationsFailure({
                error,
                message: 'Failed to load more organisations',
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
            return of(
              OrganisationsActions.createOrganisationFailure({
                error,
                message: 'Failed to create organisation',
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
                message: 'Failed to update organisation',
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
            return of(
              OrganisationsActions.getDataWarehouseLastUpdatedFailure({
                error,
                message: 'Failed to get data warehouse last updated',
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
          catchError((error) =>
            of(
              OrganisationsActions.createOrganisationSharepointFolderFailure({
                error,
                message: 'Failed to create sharepoint folder',
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
            catchError((error) =>
              of(
                OrganisationsActions.refreshOrganisationsFailure({
                  error,
                  message: 'Failed to refresh organisations',
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

export const updateOrganisationDescription = createEffect(
  (
    actions$ = inject(Actions),
    organisationsService = inject(OrganisationsService),
  ) => {
    return actions$.pipe(
      ofType(OrganisationsActions.updateOrganisationDescription),
      switchMap(({ id, description }) =>
        organisationsService.patchOrganisation(id, { description }).pipe(
          map((response) => {
            return OrganisationsActions.updateOrganisationDescriptionSuccess({
              data: response.data!,
            });
          }),
          catchError((error) =>
            of(
              OrganisationsActions.updateOrganisationDescriptionFailure({
                error,
                message: 'Failed to update organisation description',
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

export const showOrganisationsErrorMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        OrganisationsActions.getOrganisationsFailure,
        OrganisationsActions.createOrganisationFailure,
        OrganisationsActions.updateOrganisationFailure,
        OrganisationsActions.getDataWarehouseLastUpdatedFailure,
        OrganisationsActions.createOrganisationSharepointFolderFailure,
        OrganisationsActions.updateOrganisationDescriptionFailure,
      ),
      filter(({ message }) => !!message),
      map(({ message, error }) => {
        console.error('Effect Error', error);
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
