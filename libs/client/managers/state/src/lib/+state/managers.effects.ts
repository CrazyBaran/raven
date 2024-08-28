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

export const getManager$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.getManager),
      switchMap(({ id }) =>
        managersService.getManager(id).pipe(
          map((response) =>
            ManagersActions.getManagerSuccess({
              data: response.data!,
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.getManagerFailure({
                error,
                message: 'Get Reminder Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateManager$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.updateManager),
      switchMap(({ id, changes }) =>
        managersService.updateManager(id, changes).pipe(
          switchMap(() => managersService.getManager(id)),
          map((response) =>
            ManagersActions.updateManagerSuccess({
              data: response.data!,
              message: 'Manager Updated.',
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.updateManagerFailure({
                error,
                message: 'Update Manager Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
