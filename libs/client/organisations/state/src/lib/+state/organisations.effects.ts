import { inject } from '@angular/core';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from './organisations.actions';

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
