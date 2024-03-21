/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { inject, Signal } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import {
  patchState,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ActionCreator } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Observable, pipe, switchMap, tap } from 'rxjs';

export type ChartState<Entity> = {
  isLoading: boolean;
  data: {
    total: number;
    data: Entity[];
  };
};

export type WithChartSettings = {
  listenOnInit?: boolean;
  take?: number;
};

const defaultSettings: WithChartSettings = {
  listenOnInit: true,
  take: 500,
};

export type ChartLoadDataMethod<Entity> = (
  params: Record<string, string | string[] | number | number[] | boolean>,
) => Observable<{ data: Entity[]; total: number }>;

export function withChart<Entity>(settings?: {
  defaultSort?: SortDescriptor[];
  refreshOnActions?: ActionCreator<any, any>[];
}) {
  const options = { ...defaultSettings, ...settings };
  return signalStoreFeature(
    {
      signals: type<{
        additionalParams?: Signal<
          Record<string, string | string[] | number | number[] | boolean>
        >;
      }>(),
      methods: type<{
        loadData: ChartLoadDataMethod<Entity>;
      }>(),
    },
    withState<ChartState<Entity>>({
      isLoading: false,
      data: {
        total: 0,
        data: [],
      },
    }),
    withMethods((store) => ({
      loadData: rxMethod<Record<string, any>>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap((params) =>
            store.loadData({ take: options.take!, ...params }).pipe(
              tapResponse({
                next: (data) => {
                  patchState(store, {
                    data,
                    isLoading: false,
                  });
                },
                error: (error) => console.error('Error', error),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),
      refresh: rxMethod(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap(() =>
            store.loadData({}).pipe(
              tapResponse({
                next: (data) =>
                  patchState(store, {
                    data,
                  }),
                error: (error) => console.error('Error', error),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),
    })),
    withHooks((store, actions$ = inject(Actions)) => ({
      onInit: () => {
        if (options.listenOnInit) {
          store.loadData({});
        }

        if (options.refreshOnActions) {
          const resetPage$ = actions$.pipe(ofType(...options.refreshOnActions));
          store.refresh(resetPage$);
        }
      },
    })),
  );
}
