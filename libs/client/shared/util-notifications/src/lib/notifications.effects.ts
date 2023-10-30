import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { NotificationsActions } from './notifications.actions';
import { RavenNotificationsService } from './raven-notifications.service';

export const successNotification$ = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(RavenNotificationsService),
  ) =>
    actions$.pipe(
      ofType(NotificationsActions.showSuccessNotification),
      tap((action) => notificationService.showSuccessNotification(action)),
    ),
  { dispatch: false, functional: true },
);

export const errorNotification$ = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(RavenNotificationsService),
  ) =>
    actions$.pipe(
      ofType(NotificationsActions.showErrorNotification),
      tap((action) =>
        'error' in action
          ? notificationService.showErrorNotification({
              content: action.error?.toString() || 'Unknown error',
            })
          : notificationService.showErrorNotification(action),
      ),
    ),
  { dispatch: false, functional: true },
);

export const infoNotification$ = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(RavenNotificationsService),
  ) =>
    actions$.pipe(
      ofType(NotificationsActions.showInfoNotification),
      tap((action) => notificationService.showInfoNotification(action)),
    ),
  { dispatch: false, functional: true },
);

export const warningNotification$ = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(RavenNotificationsService),
  ) =>
    actions$.pipe(
      ofType(NotificationsActions.showWarningNotification),
      tap((action) => notificationService.showWarningNotification(action)),
    ),
  { dispatch: false, functional: true },
);
