import { inject } from '@angular/core';
import { RemindersService } from '@app/client/reminders/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { RemindersActions } from './reminders.actions';
import { remindersQuery } from './reminders.selectors';

export const getReminders$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.getReminders),
      switchMap(({ query }) =>
        remindersService.getReminders(query).pipe(
          map((response) => {
            return RemindersActions.getRemindersSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.getRemindersFailure({
                error,
                message: 'Get Reminders Failed.',
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

export const loadMoreReminders$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.loadMoreReminders),
      switchMap(({ query }) =>
        remindersService.getReminders(query).pipe(
          map((response) => {
            return RemindersActions.loadMoreRemindersSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.loadMoreRemindersFailure({
                error,
                message: 'Load More Reminders Failed.',
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

export const getReminder$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.getReminder),
      switchMap(({ id }) =>
        remindersService.getReminder(id).pipe(
          map((response) => {
            return RemindersActions.getReminderSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.getReminderFailure({
                error,
                message: 'Get Reminder Failed.',
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

export const getReminderIfNotLoaded$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(RemindersActions.getReminderIfNotLoaded),
      concatLatestFrom(() => store.select(remindersQuery.selectEntities)),
      filter(([{ id }, entities]) => !entities[id]),
      map(([{ id }]) => RemindersActions.getReminder({ id })),
    );
  },
  {
    functional: true,
  },
);

export const deleteReminder$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.deleteReminder),
      switchMap(({ id }) =>
        remindersService.deleteReminder(id).pipe(
          map(() => {
            return RemindersActions.deleteReminderSuccess({
              data: { id },
              message: 'Reminder Deleted.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.deleteReminderFailure({
                error,
                message: 'Delete Reminder Failed.',
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

export const updateReminder$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.updateReminder),
      switchMap(({ id, changes }) =>
        remindersService.updateReminder(id, changes).pipe(
          map((response) => {
            return RemindersActions.updateReminderSuccess({
              data: response.data!,
              message: 'Reminder Updated.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.updateReminderFailure({
                error,
                message: 'Update Reminder Failed.',
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

export const completeReminder$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.completeReminder),
      switchMap(({ ids }) =>
        remindersService.completeReminder(ids).pipe(
          map(() => {
            return RemindersActions.completeReminderSuccess({
              data: { ids },
              message: 'Reminder Completed.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.completeReminderFailure({
                error,
                message: 'Complete Reminder Failed.',
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

export const createReminder$ = createEffect(
  (actions$ = inject(Actions), remindersService = inject(RemindersService)) => {
    return actions$.pipe(
      ofType(RemindersActions.createReminder),
      switchMap(({ data }) => {
        return remindersService.createReminder(data).pipe(
          map((response) => {
            return RemindersActions.createReminderSuccess({
              data: response.data!,
              message: 'Reminder Created.',
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.createReminderFailure({
                error,
                message: 'Create Reminder Failed.',
              }),
            );
          }),
        );
      }),
    );
  },
  {
    functional: true,
  },
);

export const showReminderSuccessMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        RemindersActions.deleteReminderSuccess,
        RemindersActions.updateReminderSuccess,
        RemindersActions.createReminderSuccess,
        RemindersActions.completeReminderSuccess,
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

export const reloadRemindersTableEvents$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(RemindersActions.createReminderSuccess),
      map(() => RemindersActions.reloadRemindersTable()),
    );
  },
  {
    functional: true,
  },
);
export const reloadRemindersTable$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    remindersService = inject(RemindersService),
  ) => {
    return actions$.pipe(
      ofType(RemindersActions.reloadRemindersTable),
      concatLatestFrom(() =>
        store.select(remindersQuery.selectReloadTableParams),
      ),
      switchMap(([, query]) =>
        remindersService.getReminders(query).pipe(
          map((response) => {
            return RemindersActions.reloadRemindersTableSuccess({
              data: response.data!,
            });
          }),
          catchError((error) => {
            console.error('Error', error);
            return of(
              RemindersActions.reloadRemindersTableFailure({
                error,
                message: 'Load More Reminders Failed.',
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

export const showReminderErrorMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        RemindersActions.getRemindersFailure,
        RemindersActions.loadMoreRemindersFailure,
        RemindersActions.reloadRemindersTableFailure,
        RemindersActions.getReminderFailure,
        RemindersActions.deleteReminderFailure,
        RemindersActions.updateReminderFailure,
        RemindersActions.createReminderFailure,
        RemindersActions.completeReminderFailure,
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
