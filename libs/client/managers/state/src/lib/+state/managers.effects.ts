import { inject } from '@angular/core';
import { ManagersService } from '@app/client/managers/data-access';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ManagersActions } from './managers.actions';
import { managersQuery } from './managers.selectors';

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

export const getManagerIfNotLoaded$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(ManagersActions.getManagerIfNotLoaded),
      concatLatestFrom(() => store.select(managersQuery.selectEntities)),
      filter(([{ id }, entities]) => !entities[id]),
      map(([{ id }]) => ManagersActions.getManager({ id })),
    );
  },
  { functional: true },
);
