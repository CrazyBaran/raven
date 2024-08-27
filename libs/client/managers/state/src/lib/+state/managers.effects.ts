import { inject } from '@angular/core';
import { ManagersService } from '@app/client/managers/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ManagersActions } from './managers.actions';

export const getManagers$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.getManagers),
      switchMap(({ query }) =>
        managersService.getManagers(query).pipe(
          map((response) =>
            ManagersActions.getManagersSuccess({
              data: response.data!,
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.getManagersFailure({
                error,
                message: 'Get Managers Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadMoreManagers$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.loadMoreManagers),
      switchMap(({ query }) =>
        managersService.getManagers(query).pipe(
          map((response) =>
            ManagersActions.loadMoreManagersSuccess({
              data: response.data!,
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.loadMoreManagersFailure({
                error,
                message: 'Load More Managers Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
