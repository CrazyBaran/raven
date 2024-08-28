import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { LoadingState } from '@app/client/shared/util';
import { FundManagerData } from '@app/rvns-fund-managers';
import { ManagersActions } from './managers.actions';

export type ManagersLoadingStates = LoadingState<
  | 'get'
  | 'create'
  | 'update'
  | 'complete'
  | 'delete'
  | 'table'
  | 'loadMoreTable'
  | 'reloadTable'
>;

export interface ManagersState extends EntityState<FundManagerData> {
  table: {
    ids: string[];
    total: number;
  };
  loadingStates: ManagersLoadingStates;
}

export const managersAdapter: EntityAdapter<FundManagerData> =
  createEntityAdapter<FundManagerData>();

export const initialManagersState: ManagersState =
  managersAdapter.getInitialState({
    loadingStates: {},
    table: {
      ids: [],
      total: 0,
    },
  });

export const managersFeature = createFeature({
  name: 'managers',
  reducer: createReducer(
    initialManagersState,
    on(ManagersActions.openManagersTable, (state) => ({
      ...state,
      table: { ids: [], total: 0 },
    })),

    on(ManagersActions.getManagers, (state) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        table: true,
      },
    })),
    on(
      ManagersActions.getManagersSuccess,
      (state, { data: { items, total } }) => {
        return managersAdapter.upsertMany([...items], {
          ...state,
          table: {
            total: total,
            ids: items.map((x) => x.id),
          },
          loadingStates: {
            ...state.loadingStates,
            table: false,
          },
        });
      },
    ),
    on(ManagersActions.getManagersFailure, (state) => ({
      ...state,
      table: {
        total: 0,
        ids: [],
      },
      loadingStates: { ...state.loadingStates, table: false },
    })),

    on(ManagersActions.loadMoreManagers, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: true },
    })),
    on(ManagersActions.loadMoreManagersSuccess, (state, { data: { items } }) =>
      managersAdapter.upsertMany(items, {
        ...state,
        table: {
          ...state.table,
          ids: [...state.table.ids, ...items.map(({ id }) => id)],
        },
        loadingStates: {
          ...state.loadingStates,
          loadMoreTable: false,
        },
      }),
    ),
    on(ManagersActions.loadMoreManagersFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: false },
    })),

    on(ManagersActions.getManager, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: true },
    })),
    on(ManagersActions.getManagerSuccess, (state, { data }) =>
      managersAdapter.upsertOne(data, {
        ...state,
        loadingStates: { ...state.loadingStates, get: false },
      }),
    ),
    on(ManagersActions.getManagerFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: false },
    })),

    on(ManagersActions.updateManager, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: true },
    })),
    on(ManagersActions.updateManagerSuccess, (state, { data }) =>
      managersAdapter.updateOne(
        { id: data.id, changes: data },
        {
          ...state,
          loadingStates: { ...state.loadingStates, update: false },
        },
      ),
    ),
    on(ManagersActions.updateManagerFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: false },
    })),
  ),
  extraSelectors: ({ selectManagersState }) => ({
    ...managersAdapter.getSelectors(selectManagersState),
  }),
});
