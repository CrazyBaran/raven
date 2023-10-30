import { createActionGroup, props } from '@ngrx/store';
import {
  ErrorNotification,
  InfoNotification,
  SuccessNotification,
  WarningNotification,
} from './raven-notifications.service';

export const NotificationsActions = createActionGroup({
  source: 'NOTIFICATION',
  events: {
    'Show Success Notification': props<SuccessNotification>(),
    'Show Error Notification': props<ErrorNotification | { error: unknown }>(),
    'Show Warning Notification': props<WarningNotification>(),
    'Show Info Notification': props<InfoNotification>(),
  },
});
