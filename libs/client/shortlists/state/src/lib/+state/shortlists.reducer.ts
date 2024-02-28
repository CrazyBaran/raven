import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ShortlistsActions } from './shortlists.actions';
import { ShortlistEntity } from './shortlists.model';

export type ShortlistsLoadingStates = Partial<
  Record<
    | 'create'
    | 'update'
    | 'table'
    | 'loadMoreTable'
    | 'get'
    | 'delete'
    | 'bulkAdd'
    | 'bulkRemove',
    boolean
  >
>;

export interface ShortlistsState extends EntityState<ShortlistEntity> {
  table: {
    ids: string[];
    total: number;
  };
  myShortlist: ShortlistEntity | undefined | null;
  mainShortlist: ShortlistEntity | undefined | null;
  loadingStates: ShortlistsLoadingStates;
}

export const shortlistAdapter: EntityAdapter<ShortlistEntity> =
  createEntityAdapter<ShortlistEntity>();

export const initialShortlistState: ShortlistsState =
  shortlistAdapter.getInitialState({
    loadingStates: {},
    myShortlist: null,
    mainShortlist: null,
    table: {
      ids: [],
      total: 0,
    },
  });

export const shortlistsFeature = createFeature({
  name: 'shortlists',
  reducer: createReducer(
    initialShortlistState,
    //////////////////////////
    on(ShortlistsActions.openShortlistTable, (state) => ({
      ...state,
      table: { ids: [], total: 0 },
    })),
    on(ShortlistsActions.getShortlists, (state) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        table: true,
      },
    })),
    on(
      ShortlistsActions.getShortlistsSuccess,
      (state, { data: { items, total, extras } }) => {
        const my = extras.find((x) => x.type === 'personal');
        const main = extras.find((x) => x.id !== my?.id);

        return shortlistAdapter.upsertMany([...items], {
          ...state,
          table: {
            total: total,
            ids: items.map((x) => x.id),
          },
          loadingStates: {
            ...state.loadingStates,
            table: false,
          },
          mainShortlist: main,
          myShortlist: my
            ? ({ ...my, type: 'my' } satisfies ShortlistEntity)
            : null,
        });
      },
    ),

    on(ShortlistsActions.getShortlistsFailure, (state) => ({
      ...state,
      table: {
        total: 0,
        ids: [],
      },
      loadingStates: { ...state.loadingStates, table: false },
    })),

    on(ShortlistsActions.getShortlistExtrasSuccess, (state, { data }) => {
      const my = data.find((x) => x.type === 'personal');
      const main = data.find((x) => x.type === 'main');

      return {
        ...state,
        mainShortlist: main,
        myShortlist: my
          ? ({ ...my, type: 'my' } satisfies ShortlistEntity)
          : null,
      };
    }),

    //////////////////////////
    on(ShortlistsActions.getShortlist, (state, { id }) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: true },
    })),

    on(ShortlistsActions.getShortlistSuccess, (state, { data }) =>
      shortlistAdapter.upsertOne(data, {
        ...state,
        loadingStates: { ...state.loadingStates, get: false },
      }),
    ),

    on(ShortlistsActions.getShortlistFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: false },
    })),
    //////////////////////////
    on(ShortlistsActions.createShortlist, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, create: true },
    })),

    on(ShortlistsActions.createShortlistSuccess, (state, { data }) =>
      shortlistAdapter.addOne(data, {
        ...state,
        loadingStates: { ...state.loadingStates, create: false },
      }),
    ),

    on(ShortlistsActions.createShortlistFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, create: false },
    })),
    //////////////////////////
    on(ShortlistsActions.updateShortlist, (state, { id, changes }) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: true },
    })),

    on(ShortlistsActions.updateShortlistSuccess, (state, { data }) =>
      shortlistAdapter.updateOne(
        { id: data.id, changes: data },
        {
          ...state,
          loadingStates: { ...state.loadingStates, update: false },
        },
      ),
    ),

    on(ShortlistsActions.updateShortlistFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: false },
    })),
    //////////////////////////
    on(ShortlistsActions.deleteShortlist, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, delete: true },
    })),

    on(ShortlistsActions.deleteShortlistSuccess, (state, { data: { id } }) =>
      shortlistAdapter.removeOne(id, {
        ...state,
        loadingStates: { ...state.loadingStates, delete: false },
      }),
    ),

    on(ShortlistsActions.deleteShortlistFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, delete: false },
    })),

    //////////////////////////
    on(ShortlistsActions.loadMoreShortlists, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: true },
    })),

    on(
      ShortlistsActions.loadMoreShortlistsSuccess,
      (state, { data: { items } }) =>
        shortlistAdapter.upsertMany(items, {
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

    on(ShortlistsActions.loadMoreShortlistsFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: false },
    })),

    //////////////////////////
    on(ShortlistsActions.bulkAddOrganisationsToShortlist, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, bulkAdd: true },
    })),
    on(ShortlistsActions.bulkAddOrganisationsToShortlistSuccess, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, bulkAdd: false },
    })),
    on(ShortlistsActions.bulkAddOrganisationsToShortlistFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, bulkAdd: false },
    })),

    //////////////////////////
    on(ShortlistsActions.bulkRemoveOrganisationsFromShortlist, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, bulkRemove: true },
    })),
    on(
      ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
      (state) => ({
        ...state,
        loadingStates: { ...state.loadingStates, bulkRemove: false },
      }),
    ),
    on(
      ShortlistsActions.bulkRemoveOrganisationsFromShortlistFailure,
      (state) => ({
        ...state,
        loadingStates: { ...state.loadingStates, bulkRemove: false },
      }),
    ),
  ),

  extraSelectors: ({ selectShortlistsState }) => ({
    ...shortlistAdapter.getSelectors(selectShortlistsState),
  }),
});
