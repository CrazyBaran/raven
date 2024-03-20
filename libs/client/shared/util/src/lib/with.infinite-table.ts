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
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { LoadDataMethod, WithTableSettings } from './with.table';

export type InfiniteTableState<Entity> = {
  pageState: {
    skip: number;
    take: number;
  };
  isLoading: boolean;
  data: {
    total: number;
    data: Entity[];
  };
  sort: SortDescriptor[];
  defaultAmountOfRecords: number;
  loadedMore: boolean;
  tableHeight: number;
};

const defaultSettings: WithTableSettings = {
  defaultSort: [],
  take: 10,
  skip: 0,
  debounceTime: 50,
  scrollDebounceTime: 150,
  listenOnInit: true,
};

export function withInfiniteTable<Entity>(settings?: {
  defaultSort?: SortDescriptor[];
  defaultAmountOfRecords?: number;
  take?: number;
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
      }>(),
    },
    withState<InfiniteTableState<Entity>>({
      pageState: {
        skip: options.skip!,
        take: options.take!,
      },
      isLoading: false,
      data: {
        total: 0,
        data: [],
      },
      sort: options?.defaultSort ?? [],
      defaultAmountOfRecords: options?.defaultAmountOfRecords ?? 4,
      loadedMore: false,
      tableHeight: 0,
    }),
    withComputed((store) => ({
      tableParams: computed(() => ({
        ...store.pageState(),
        ...(store.sort?.() ?? {}),
        ...(store.additionalParams?.() ?? {}),
      })),
      canLoadMore: computed(
        () =>
          !store.loadedMore() &&
          store.data.total() > store.defaultAmountOfRecords(),
      ),
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
      scrollBottom: rxMethod<void>(
        pipe(
          debounceTime(options.scrollDebounceTime!),
          tap(() => {
            if (
              !store.isLoading() &&
              store.data.total() > store.data.data().length
            ) {
              patchState(store, {
                pageState: {
                  ...store.pageState(),
                  skip: store.pageState().skip + store.pageState().take,
                },
              });
            }
          }),
        ),
      ),
      sortChange: rxMethod<SortDescriptor[]>(
        pipe(
          tap((sorts) =>
            patchState(store, {
              sort: sorts,
              pageState: { ...store.pageState(), skip: 0 },
            }),
          ),
        ),
      ),
      loadData: rxMethod<Record<string, any>>(
        pipe(
          debounceTime(options.debounceTime!),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            store.loadData(params).pipe(
              tapResponse({
                next: (data) => {
                  patchState(store, {
                    data: {
                      data:
                        store.pageState.skip() === 0
                          ? data.data
                          : [...store.data().data, ...data.data],
                      total: data.total,
                    },
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
      loadMore(tableHeight?: number): void {
        patchState(store, () => ({
          loadedMore: true,
          tableHeight: tableHeight ?? 0,
        }));
      },
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
