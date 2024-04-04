/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { computed, Signal } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SortDescriptor } from '@progress/kendo-data-query';
import {
  debounceTime,
  filter,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { LoadDataMethod, WithTableSettings } from './with.table';

export type DateRangeInfiniteTableState<Entity> = {
  pageState: {
    startTime?: number | null;
    endTime?: number | null;
  };
  isLoading: boolean;
  data: {
    total: number;
    data: Entity[];
  };
  defaultAmountOfRecords: number;
  loadedMore: boolean;
  tableHeight: number;
  canLoadMore: boolean;
  firstInteraction: number | null;
};

type WithDateRangeTableSettings = WithTableSettings & {
  datePagination?: boolean;
  startTime?: Date | null;
};

const defaultSettings: WithDateRangeTableSettings = {
  listenOnInit: true,
  datePagination: false,
};

export type LoadParamMethod<Entity> = () => Observable<{ data: Entity }>;

export function withDateRangeInfiniteTable<Entity>(settings?: {
  defaultSort?: SortDescriptor[];
  defaultAmountOfRecords?: number;
  take?: number;
  startTime?: Date | null;
  endTime?: Date | null;
  daysInterval?: number;
  canLoadMore?: boolean;
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
        loadData: LoadDataMethod<Entity>;
        preloadEndTime: LoadParamMethod<Date | null>;
      }>(),
    },
    withState<DateRangeInfiniteTableState<Entity>>({
      pageState: {
        startTime: options.startTime?.getTime(),
        endTime: options.endTime?.getTime(),
      },
      isLoading: false,
      data: {
        total: 0,
        data: [],
      },
      defaultAmountOfRecords: options?.defaultAmountOfRecords ?? 4,
      loadedMore: false,
      tableHeight: 0,
      canLoadMore: true,
      firstInteraction: null,
    }),
    withComputed((store) => ({
      tableParams: computed(() => ({
        ...store.pageState(),
        ...(store.additionalParams?.() ?? {}),
      })),
      loadMoreAmount: computed(
        () => store.data().total - store.defaultAmountOfRecords(),
      ),
      filteredData: computed(() => ({
        ...store.data(),
        data: store.loadedMore()
          ? store.data().data
          : store.data().data.slice(0, store.defaultAmountOfRecords()),
      })),
    })),
    withMethods((store) => ({
      loadMore: rxMethod<void>(
        pipe(
          debounceTime(options.scrollDebounceTime!),
          tap(() => {
            const nextStartDate = new Date(store.pageState().startTime!);
            nextStartDate.setDate(
              nextStartDate.getDate()! - options.daysInterval!,
            );

            if (
              !store.isLoading() &&
              store.data.total() > store.data.data().length
            ) {
              patchState(store, {
                pageState: {
                  ...store.pageState(),
                  endTime: store.pageState().startTime,
                  startTime: nextStartDate.getTime(),
                },
              });
            }
          }),
        ),
      ),
      preloadEndTime: rxMethod<void>(
        pipe(
          debounceTime(options.debounceTime!),
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap(() => store.preloadEndTime()),
          switchMap((dateParam: { data: Date | null }) => {
            if (dateParam.data) {
              const startDate = new Date(dateParam.data);
              const endDate = new Date(dateParam.data);

              startDate.setDate(startDate.getDate()! - options.daysInterval!);
              const params = {
                endTime: endDate.getTime(),
                startTime: startDate.getTime(),
              };
              patchState(store, {
                pageState: {
                  ...params,
                },
                canLoadMore: true,
                firstInteraction: endDate.getTime(),
              });
            } else {
              patchState(store, {
                canLoadMore: false,
                isLoading: false,
              });
            }

            return of(dateParam);
          }),
        ),
      ),
      loadData: rxMethod<Record<string, any>>(
        pipe(
          debounceTime(options.debounceTime!),
          filter(
            (params) => params && params['startTime'] && params['endTime'],
          ),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            store.loadData(params).pipe(
              tapResponse({
                next: (data) => {
                  patchState(store, {
                    data: {
                      data: [...store.data().data, ...data.data],
                      total: data.total,
                    },
                    loadedMore: true,
                  });
                },
                error: (error) => console.error('Error', error),
                finalize: () =>
                  patchState(store, {
                    isLoading: false,
                  }),
              }),
            ),
          ),
        ),
      ),
      reset: rxMethod(
        pipe(
          tap((firstInteraction: number | null) => {
            if (firstInteraction) {
              const endTime = firstInteraction;
              const startDate = new Date(firstInteraction);

              startDate.setDate(startDate.getDate()! - options.daysInterval!);
              patchState(store, {
                data: { total: 0, data: [] },
                pageState: {
                  ...store.pageState(),
                  startTime: startDate.getTime(),
                  endTime: endTime,
                },
              });
            }
          }),
        ),
      ),
    })),
    withHooks((store) => ({
      onInit: () => {
        if (options.listenOnInit) {
          store.preloadEndTime();
          store.loadData(store.tableParams);
        }
      },
    })),
  );
}
