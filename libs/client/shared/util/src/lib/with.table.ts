/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { computed, inject, Signal } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
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
import { ActionCreator } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { debounceTime, Observable, pipe, switchMap, tap } from 'rxjs';

export type TableState<Entity> = {
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
};

export type WithTableSettings = {
  defaultSort?: SortDescriptor[];
  take?: number;
  skip?: number;
  debounceTime?: number;
  scrollDebounceTime?: number;
  listenOnInit?: boolean;
};

const defaultSettings: WithTableSettings = {
  defaultSort: [],
  take: 5,
  skip: 0,
  debounceTime: 50,
  listenOnInit: true,
};

export type LoadDataMethod<Entity> = (
  params: Record<string, string | string[] | number | number[] | boolean>,
) => Observable<{ data: Entity[]; total: number }>;

export function withTable<Entity>(settings?: {
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
        loadData: LoadDataMethod<Entity>;
      }>(),
    },
    withState<TableState<Entity>>({
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
    }),
    withComputed((store) => ({
      tableParams: computed(() => {
        if (store.sort()[0]) {
          return {
            ...store.pageState(),
            ...store.sort()[0],
            ...(store.additionalParams?.() ?? {}),
          };
        }
        return {
          ...store.pageState(),
          ...(store.additionalParams?.() ?? {}),
        };
      }),
      pageable: computed(() => store.data().total > store.pageState().take),
    })),
    withMethods((store) => ({
      pageChange: rxMethod<PageChangeEvent>(
        pipe(
          tap((page) => {
            patchState(store, { pageState: page });
          }),
        ),
      ),
      sortChange: rxMethod<SortDescriptor[]>(
        pipe(
          tap((sorts) => {
            patchState(store, { sort: sorts });
          }),
        ),
      ),

      loadData: rxMethod<Record<string, any>>(
        pipe(
          debounceTime(options.debounceTime!),
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap((params) =>
            store.loadData(params).pipe(
              tapResponse({
                next: (data) => {
                  console.log(data);
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
            store.loadData(store.tableParams() as Record<string, any>).pipe(
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
        const tableParams = store.tableParams;
        if (options.listenOnInit) {
          store.loadData(tableParams);
        }

        if (options.refreshOnActions) {
          const resetPage$ = actions$.pipe(ofType(...options.refreshOnActions));
          store.refresh(resetPage$);
        }
      },
    })),
  );
}
