import { computed, inject } from '@angular/core';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { LoadDataMethod, withTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import {
  ShortlistEntity,
  ShortlistsActions,
} from '@app/client/shortlists/state';
import { ShortlistUtil } from '@app/client/shortlists/utils';
import { tapResponse } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { debounceTime, map, pipe, switchMap, tap } from 'rxjs';

export type OrganisationShortlistsTableState = {
  pageState: {
    skip: number;
    take: number;
  };
  isLoading: boolean;
  data: {
    total: number;
    data: ShortlistEntity[];
  };
  sort: SortDescriptor;
};

const initialState: OrganisationShortlistsTableState = {
  pageState: {
    skip: 0,
    take: 5,
  },
  isLoading: false,
  data: {
    total: 0,
    data: [],
  },
  sort: {
    field: 'name',
    dir: 'desc',
  },
};

export const organisationShortlistsTableStore2 = signalStore(
  withState(initialState),
  withComputed((store, ngrxStore = inject(Store)) => ({
    organisationId: ngrxStore.selectSignal(
      routerQuery.selectCurrentOrganisationId,
    ),
    params: computed(() => ({
      ...store.pageState(),
      ...store.sort(),
      organisationId: ngrxStore.selectSignal(
        routerQuery.selectCurrentOrganisationId,
      )()!,
    })),
  })),
  withMethods((store, shortlistService = inject(ShortlistsService)) => ({
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
          patchState(store, { sort: sorts[0] });
        }),
      ),
    ),
    loadShortlists: rxMethod<{
      skip?: string | number;
      take?: string | number;
      field?: string;
      dir?: string;
      organisationId: string;
    }>(
      pipe(
        debounceTime(50),
        tap(() => {
          patchState(store, { isLoading: true });
        }),
        switchMap((params) =>
          shortlistService.getShortlists(params).pipe(
            map((response) => {
              const personalShortlist = ShortlistUtil.findMyShortlistFromExtras(
                response.data?.extras,
              );
              return {
                total: response.data?.total ?? 0,
                data:
                  (response.data?.items.map((shortlist) => ({
                    ...shortlist,
                    type:
                      personalShortlist?.id === shortlist.id
                        ? 'my'
                        : shortlist.type,
                    contributors:
                      shortlist.contributors.map(({ name }) => name) ?? [],
                  })) as never) ?? [],
              };
            }),
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
);

export const organisationShortlistsTableStore = signalStore(
  withComputed((store, ngrxStore = inject(Store)) => ({
    additionalParams: computed(() => ({
      organisationId: ngrxStore.selectSignal(
        routerQuery.selectCurrentOrganisationId,
      )()!,
    })),
  })),
  withMethods((store, shortlistsService = inject(ShortlistsService)) => ({
    loadData: getLoadShortlistData(shortlistsService),
  })),
  withTable<ShortlistEntity>(),
  withHooks((store, actions$ = inject(Actions)) => ({
    onInit: (): void => {
      const resetPage$ = actions$.pipe(
        ofType(
          ShortlistsActions.bulkAddOrganisationsToShortlistSuccess,
          ShortlistsActions.deleteShortlistSuccess,
          ShortlistsActions.createShortlistSuccess,
          ShortlistsActions.updateShortlistSuccess,
          ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
          OpportunitiesActions.createOpportunitySuccess,
        ),
      );
      store.refresh(resetPage$);
    },
  })),
);

export const getLoadShortlistData =
  (shortlistService: ShortlistsService): LoadDataMethod<ShortlistEntity> =>
  (params) =>
    shortlistService.getShortlists(params).pipe(
      map((response) => {
        const personalShortlist = ShortlistUtil.findMyShortlistFromExtras(
          response.data?.extras,
        );
        return {
          total: response.data?.total ?? 0,
          data:
            (response.data?.items.map((shortlist) => ({
              ...shortlist,
              type:
                personalShortlist?.id === shortlist.id ? 'my' : shortlist.type,
              contributors:
                shortlist.contributors.map(({ name }) => name) ?? [],
            })) as never) ?? [],
        };
      }),
    );
