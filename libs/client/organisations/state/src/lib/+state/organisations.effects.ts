import { inject } from '@angular/core';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrganisationsActions } from './organisations.actions';

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
              data: response.data || [],
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
