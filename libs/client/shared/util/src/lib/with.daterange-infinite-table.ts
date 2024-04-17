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
import { debounceTime, Observable, pipe, switchMap, tap } from 'rxjs';
import { WithTableSettings } from './with.table';

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
  nextInteraction: number | null;
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

export type LoadDataWithExtrasMethod<Entity> = (
  params: Record<string, string | string[] | number | number[] | boolean>,
) => Observable<{ data: Entity[]; total: number; extras: string }>;

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
        loadData: LoadDataWithExtrasMethod<Entity>;
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
      nextInteraction: null,
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
            const nextStartDate = new Date(store.nextInteraction()!);
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
                  endTime: store.nextInteraction()! + 1,
                  startTime: nextStartDate.getTime(),
                },
              });
            }
          }),
        ),
      ),
      loadData: rxMethod<Record<string, any>>(
        pipe(
          debounceTime(options.debounceTime!),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) => {
            return store.loadData(params).pipe(
              tapResponse({
                next: (data) => {
                  const nextInteraction = data.extras
                    ? new Date(data.extras).getTime()
                    : null;
                  patchState(store, {
                    data: {
                      data: [...store.data().data, ...data.data],
                      total: data.total,
                    },
                    loadedMore: true,
                    nextInteraction,
                    canLoadMore: nextInteraction !== null,
                  });
                },
                error: (error) => console.error('Error', error),
                finalize: () =>
                  patchState(store, {
                    isLoading: false,
                  }),
              }),
            );
          }),
        ),
      ),
      reset: rxMethod(
        pipe(
          tap(() => {
            patchState(store, {
              data: { total: 0, data: [] },
              pageState: {
                ...store.pageState(),
                startTime: undefined,
                endTime: undefined,
              },
            });
          }),
        ),
      ),
    })),
    withHooks((store) => ({
      onInit: () => {
        if (options.listenOnInit) {
          store.loadData(store.tableParams);
        }
      },
    })),
  );
}
