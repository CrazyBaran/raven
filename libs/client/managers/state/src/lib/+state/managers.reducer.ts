import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { LoadingState } from '@app/client/shared/util';
import {
  FundManagerContactData,
  FundManagerData,
} from '@app/rvns-fund-managers';
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
  | 'getContact'
  | 'updateContact'
  | 'createContact'
  | 'deleteContact'
>;

export interface ManagersState extends EntityState<FundManagerData> {
  table: {
    ids: string[];
    total: number;
  };
  loadingStates: ManagersLoadingStates;
  currentContact: FundManagerContactData | undefined;
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
    currentContact: undefined,
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

    on(ManagersActions.getManagerContact, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, getContact: true },
    })),
    on(ManagersActions.getManagerContactSuccess, (state, { data }) => ({
      ...state,
      currentContact: data,
      loadingStates: { ...state.loadingStates, getContact: false },
    })),
    on(ManagersActions.getManagerFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, getContact: false },
    })),

    on(ManagersActions.createManagerContact, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, createContact: true },
    })),
    on(ManagersActions.createManagerContactSuccess, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, createContact: false },
    })),
    on(ManagersActions.createManagerContactFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, createContact: false },
    })),

    on(ManagersActions.updateManagerContact, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, updateContact: true },
    })),
    on(ManagersActions.updateManagerContactSuccess, (state, { data }) => ({
      ...state,
      currentContact: data,
      loadingStates: { ...state.loadingStates, updateContact: false },
    })),
    on(ManagersActions.updateManagerContactFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, updateContact: false },
    })),

    on(ManagersActions.removeManagerContact, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, deleteContact: true },
    })),
    on(ManagersActions.removeManagerContactSuccess, (state) => ({
      ...state,
      currentContact: undefined,
      loadingStates: { ...state.loadingStates, deleteContact: false },
    })),
    on(ManagersActions.removeManagerContactFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, deleteContact: false },
    })),
  ),
  extraSelectors: ({ selectManagersState }) => ({
    ...managersAdapter.getSelectors(selectManagersState),
  }),
});
