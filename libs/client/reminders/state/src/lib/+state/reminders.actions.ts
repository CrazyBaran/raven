import {
  CreateReminderDto,
  GetRemindersDto,
  ReminderDto,
  UpdateReminderDto,
} from '@app/client/reminders/data-access';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FailurePayload, SuccessPayload } from '@app/client/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PagedData } from 'rvns-shared';
import { ReminderEntity } from './reminders.model';

export const RemindersActions = createActionGroup({
  source: 'Reminders/API',
  events: {
    'Get Reminders': props<{ query?: GetRemindersDto }>(),
    'Get Reminders Success': props<{ data: PagedData<ReminderDto> }>(),
    'Get Reminders Failure': props<FailurePayload>(),

    'Get Reminder': props<{ id: string }>(),
    'Get Reminder Success': props<{ data: ReminderEntity }>(),
    'Get Reminder Failure': props<FailurePayload>(),

    'Get Reminder Extras': emptyProps(),
    'Get Reminder Extras Success': props<{ data: ReminderEntity[] }>(),
    'Get Reminder Extras Failure': props<FailurePayload>(),

    'Get Reminder If Not Loaded': props<{ id: string }>(),

    'Delete Reminder': props<{ id: string }>(),
    'Delete Reminder Success': props<SuccessPayload<{ id: string }>>(),
    'Delete Reminder Failure': props<FailurePayload>(),

    'Update Reminder': props<{ id: string; changes: UpdateReminderDto }>(),
    'Update Reminder Success': props<SuccessPayload<ReminderEntity>>(),
    'Update Reminder Failure': props<FailurePayload>(),

    'Complete Reminder': props<{ ids: string[] }>(),
    'Complete Reminder Success': props<SuccessPayload<{ ids: string[] }>>(),
    'Complete Reminder Failure': props<FailurePayload>(),

    'Create Reminder': props<{ data: CreateReminderDto }>(),
    'Create Reminder Success': props<SuccessPayload<ReminderEntity>>(),
    'Create Reminder Failure': props<FailurePayload>(),

    'Load More Reminders': props<{ query?: GetRemindersDto }>(),
    'Load More Reminders Success': props<{
      data: PagedData<ReminderDto>;
    }>(),
    'Load More Reminders Failure': props<FailurePayload>(),

    'Reload Reminders Table': emptyProps(),
    'Reload Reminders Table Success': props<{
      data: PagedData<ReminderDto>;
    }>(),
    'Reload Reminders Table Failure': props<FailurePayload>(),

    'Silently Reload Reminders Table': emptyProps(),
    'Silently Reload Reminders Table Success': props<{
      data: PagedData<ReminderDto>;
    }>(),
    'Silently Reload Reminders Table Failure': props<FailurePayload>(),

    'Open Reminder Table': emptyProps(),

    'Get Reminders Stats': emptyProps(),
    'Get Reminders Stats Success': props<{
      data: {
        overdue: {
          forMe: number;
          forOthers: number;
        };
      };
    }>(),
    'Get Reminders Stats Failure': props<FailurePayload>(),

    'Any Reminder Websocket Event': emptyProps(),
  },
});
