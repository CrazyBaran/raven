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
                message: 'Get Manager Failed.',
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

export const getManagerContact$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.getManagerContact),
      switchMap(({ id }) =>
        managersService.getContact(id).pipe(
          map((response) =>
            ManagersActions.getManagerContactSuccess({
              data: response.data!,
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.getManagerContactFailure({
                error,
                message: 'Get Manager Contact Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const createManagerContact$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.createManagerContact),
      switchMap(({ id, data }) =>
        managersService.createContact(id, data).pipe(
          map((response) =>
            ManagersActions.createManagerContactSuccess({
              data: response.data!,
              message: 'Manager Contact Created.',
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.createManagerContactFailure({
                error,
                message: 'Create Manager Contact Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateManagerContact$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.updateManagerContact),
      switchMap(({ id, changes }) =>
        managersService.updateContact(id, changes).pipe(
          map((response) =>
            ManagersActions.updateManagerContactSuccess({
              data: response.data!,
              message: 'Manager Contact Updated.',
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.updateManagerContactFailure({
                error,
                message: 'Update Manager Contact Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const removeManagerContact$ = createEffect(
  (actions$ = inject(Actions), managersService = inject(ManagersService)) => {
    return actions$.pipe(
      ofType(ManagersActions.removeManagerContact),
      switchMap(({ id }) =>
        managersService.removeContact(id).pipe(
          map((response) =>
            ManagersActions.removeManagerContactSuccess({
              data: response.data!,
              message: 'Manager Contact Removed.',
            }),
          ),
          catchError((error) =>
            of(
              ManagersActions.removeManagerContactFailure({
                error,
                message: 'Remove Manager Contact Failed.',
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
