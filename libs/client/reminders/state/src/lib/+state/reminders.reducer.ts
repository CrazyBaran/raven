import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { LoadingState } from '@app/client/shared/util';
import { RemindersActions } from './reminders.actions';
import { ReminderEntity } from './reminders.model';

export type RemindersLoadingStates = LoadingState<
  | 'get'
  | 'create'
  | 'update'
  | 'complete'
  | 'delete'
  | 'table'
  | 'loadMoreTable'
  | 'reloadTable'
>;

export interface RemindersState extends EntityState<ReminderEntity> {
  table: {
    ids: string[];
    total: number;
  };
  loadingStates: RemindersLoadingStates;
}

export const remindersAdapter: EntityAdapter<ReminderEntity> =
  createEntityAdapter<ReminderEntity>();

export const initialRemindersState: RemindersState =
  remindersAdapter.getInitialState({
    loadingStates: {},
    table: {
      ids: [],
      total: 0,
    },
  });

export const remindersFeature = createFeature({
  name: 'reminders',
  reducer: createReducer(
    initialRemindersState,
    //////////////////////////
    on(RemindersActions.openReminderTable, (state) => ({
      ...state,
      table: { ids: [], total: 0 },
    })),
    on(RemindersActions.getReminders, (state) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        table: true,
      },
    })),
    on(
      RemindersActions.getRemindersSuccess,
      (state, { data: { items, total } }) => {
        return remindersAdapter.upsertMany([...items], {
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

    on(RemindersActions.getRemindersFailure, (state) => ({
      ...state,
      table: {
        total: 0,
        ids: [],
      },
      loadingStates: { ...state.loadingStates, table: false },
    })),

    //////////////////////////
    on(RemindersActions.getReminder, (state, { id }) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: true },
    })),

    on(RemindersActions.getReminderSuccess, (state, { data }) =>
      remindersAdapter.upsertOne(data, {
        ...state,
        loadingStates: { ...state.loadingStates, get: false },
      }),
    ),

    on(RemindersActions.getReminderFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, get: false },
    })),
    //////////////////////////
    on(RemindersActions.createReminder, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, create: true },
    })),

    on(RemindersActions.createReminderSuccess, (state, { data }) =>
      remindersAdapter.addOne(data, {
        ...state,
        loadingStates: { ...state.loadingStates, create: false },
      }),
    ),

    on(RemindersActions.createReminderFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, create: false },
    })),
    //////////////////////////
    on(RemindersActions.updateReminder, (state, { id, changes }) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: true },
    })),

    on(RemindersActions.updateReminderSuccess, (state, { data }) =>
      remindersAdapter.updateOne(
        { id: data.id, changes: data },
        {
          ...state,
          loadingStates: { ...state.loadingStates, update: false },
        },
      ),
    ),

    on(RemindersActions.updateReminderFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, update: false },
    })),

    //////////////////////////
    //complete
    on(RemindersActions.completeReminder, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, complete: true },
    })),
    on(RemindersActions.completeReminderSuccess, (state, { data: { ids } }) =>
      remindersAdapter.updateMany(
        ids.map((id) => ({ id, changes: { type: 'completed' } })),
        {
          ...state,
          loadingStates: { ...state.loadingStates, complete: false },
        },
      ),
    ),
    on(RemindersActions.completeReminderFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, complete: false },
    })),

    //////////////////////////
    on(RemindersActions.deleteReminder, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, delete: true },
    })),

    on(RemindersActions.deleteReminderSuccess, (state, { data: { id } }) =>
      remindersAdapter.removeOne(id, {
        ...state,
        loadingStates: { ...state.loadingStates, delete: false },
      }),
    ),

    on(RemindersActions.deleteReminderFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, delete: false },
    })),

    //////////////////////////
    on(RemindersActions.loadMoreReminders, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: true },
    })),

    on(
      RemindersActions.loadMoreRemindersSuccess,
      (state, { data: { items } }) =>
        remindersAdapter.upsertMany(items, {
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

    //////////////////////////
    on(RemindersActions.reloadRemindersTable, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, reloadTable: true },
    })),

    on(
      RemindersActions.reloadRemindersTableSuccess,
      (state, { data: { items, total } }) =>
        remindersAdapter.upsertMany(items, {
          ...state,
          table: {
            total: total,
            ids: items.map((x) => x.id),
          },
          loadingStates: {
            ...state.loadingStates,
            reloadTable: false,
          },
        }),
    ),

    on(RemindersActions.reloadRemindersTableFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, reloadTable: false },
    })),
    /////

    on(RemindersActions.loadMoreRemindersFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, loadMoreTable: false },
    })),
  ),

  extraSelectors: ({ selectRemindersState }) => ({
    ...remindersAdapter.getSelectors(selectRemindersState),
  }),
});
