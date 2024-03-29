/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { computed, inject } from '@angular/core';
import { RemindersService } from '@app/client/reminders/data-access';
import { ReminderStats } from '@app/rvns-reminders';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';

export function withReminderStats() {
  return signalStoreFeature(
    withState<{
      stats: ReminderStats | null | undefined;
      reminderStatsParams:
        | {
            organisationId: string | undefined;
            opportunityId: string | undefined;
          }
        | null
        | undefined;
    }>({
      stats: null,
      reminderStatsParams: null,
    }),
    withComputed((store) => ({
      statsCount: computed(() => store.stats()?.overdue.total),
    })),
    withMethods((store, remindersService = inject(RemindersService)) => ({
      setStatsParams: rxMethod<{
        organisationId: string | undefined;
        opportunityId: string | undefined;
      }>(tap((params) => patchState(store, { reminderStatsParams: params }))),
      loadStats: rxMethod<
        | {
            organisationId: string | undefined;
            opportunityId?: string | undefined;
          }
        | null
        | undefined
      >(
        pipe(
          filter((params) => !!params),
          switchMap((params) =>
            remindersService.getRemindersStats(params!).pipe(
              tapResponse({
                next: (stats) => patchState(store, { stats: stats.data }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
    })),
    withHooks((store) => ({
      onInit: (): void => {
        store.loadStats(store.reminderStatsParams);
      },
    })),
  );
}
