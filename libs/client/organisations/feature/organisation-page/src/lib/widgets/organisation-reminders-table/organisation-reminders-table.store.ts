import { computed, inject } from '@angular/core';
import {
  ReminderDto,
  RemindersService,
} from '@app/client/reminders/data-access';
import { RemindersActions } from '@app/client/reminders/state';
import { LoadDataMethod, withTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { Actions, ofType } from '@ngrx/effects';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const organisationRemindersTableStore = signalStore(
  withComputed((store, ngrxStore = inject(Store)) => ({
    additionalParams: computed(() => ({
      organisationId: ngrxStore.selectSignal(
        routerQuery.selectCurrentOrganisationId,
      )()!,
    })),
  })),
  withMethods((store, remindersService = inject(RemindersService)) => ({
    loadData: <LoadDataMethod<ReminderDto>>((params) =>
      remindersService.getReminders(params).pipe(
        map((response) => ({
          total: response.data?.total ?? 0,
          data: response.data?.items ?? [],
        })),
      )),
  })),
  withTable<ReminderDto>(),
  withHooks((store, actions$ = inject(Actions)) => ({
    onInit: (): void => {
      const resetPage$ = actions$.pipe(
        ofType(
          RemindersActions.createReminderSuccess,
          RemindersActions.deleteReminderSuccess,
          RemindersActions.completeReminderSuccess,
          RemindersActions.updateReminderSuccess,
        ),
      );
      store.refresh(resetPage$);
    },
  })),
);
