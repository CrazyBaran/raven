import { computed, inject } from '@angular/core';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { ItemDisabledFn } from '@progress/kendo-angular-dropdowns';
import * as _ from 'lodash';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

type AddToShortlistDialogState = {
  mode: 'create' | 'add';
  filter: string;
  shortlists: {
    id: string;
    name: string;
  }[];
  addedShortlists: {
    id: string;
    name: string;
  }[];
  isLoading: boolean;
  isLoadingAddedShortlists: boolean;
};

const MY_SHORTLIST_ITEM = {
  name: 'My Shortlist',
  id: 'my',
};

const initialState: AddToShortlistDialogState = {
  mode: 'add',
  filter: '',
  isLoading: false,
  isLoadingAddedShortlists: false,
  shortlists: [],
  addedShortlists: [MY_SHORTLIST_ITEM],
};

export const addToShortlistDialogStore = signalStore(
  withState(initialState),
  withComputed((store, ngrxStore = inject(Store)) => ({
    itemDisabled: computed<ItemDisabledFn>(() => (item): boolean => {
      return store.addedShortlists().some(({ id }) => id === item.dataItem.id);
    }),
    organisations: computed<string[]>(() =>
      _.castArray(
        ngrxStore.selectSignal(
          selectQueryParam(DialogUtil.queryParams.addToShortlist),
        )(),
      ),
    ),
    loading: computed(
      () => store.isLoading() || store.isLoadingAddedShortlists(),
    ),
  })),
  withMethods((store, shortlistsService = inject(ShortlistsService)) => ({
    updateFilter(filter: string): void {
      patchState(store, { filter });
    },
    loadByFilter: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) =>
          shortlistsService.getShortlists({ query: query, take: 250 }).pipe(
            tapResponse({
              next: (response) => {
                const shortlists = [
                  MY_SHORTLIST_ITEM,
                  ...response.data!.items.filter(
                    ({ type }) => type === 'custom',
                  ),
                ];

                patchState(store, {
                  shortlists: shortlists,
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
    loadAddedShortlists: rxMethod<string[]>(
      pipe(
        distinctUntilChanged(),
        filter((organisations) => organisations.length === 1),
        tap(() => patchState(store, { isLoadingAddedShortlists: true })),
        switchMap(([organisationId]) =>
          shortlistsService.getShortlists({ organisationId, take: 200 }).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  addedShortlists: [MY_SHORTLIST_ITEM, ...response.data!.items],
                });
              },
              error: (error) => console.error('Error', error),
              finalize: () =>
                patchState(store, { isLoadingAddedShortlists: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
