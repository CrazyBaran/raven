import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { LoadingState } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ShortlistsActions } from '@app/client/shortlists/state';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from './organisations.actions';
import {
  DataWarehouseLastUpdatedEntity,
  OrganisationEntity,
} from './organisations.model';

export type OrganisationsLoadingStates = LoadingState<'updateDescription'>;

export interface OrganisationsState extends EntityState<OrganisationEntity> {
  totalRows: number;
  loaded: boolean | null;
  error: string | null;
  loadingOrganisation: boolean;
  creatingSharepointFolder: boolean;
  dataWarehouseLastUpdated: DataWarehouseLastUpdatedEntity | null;
  loadingStates: OrganisationsLoadingStates;
  updateLoading: boolean;
  table: {
    ids: string[];
    total: number;
  };
}

export const OrganisationAdapter: EntityAdapter<OrganisationEntity> =
  createEntityAdapter<OrganisationEntity>();

export const initialOrganisationState: OrganisationsState =
  OrganisationAdapter.getInitialState({
    loaded: false,
    loadingOrganisation: false,
    error: null,
    selectedId: null,
    totalRows: 0,
    creatingSharepointFolder: false,
    dataWarehouseLastUpdated: null,
    updateLoading: false,
    loadingStates: {},
    table: {
      ids: [],
      total: 0,
    },
  });

export const organisationsFeature = createFeature({
  name: 'organisations',
  reducer: createReducer(
    initialOrganisationState,

    on(
      OrganisationsActions.getOrganisation,

      (state) => ({
        ...state,
        loadingOrganisation: true,
        error: null,
      }),
    ),
    on(OrganisationsActions.getOrganisationSuccess, (state, { data }) =>
      data
        ? OrganisationAdapter.upsertOne(data, {
            ...state,
            loadingOrganisation: false,
          })
        : { ...state, loadingOrganisation: false },
    ),
    on(OrganisationsActions.getOrganisationFailure, (state, { error }) => ({
      ...state,
      error,
      loadingOrganisation: false,
    })),

    on(OrganisationsActions.refreshOrganisationsSuccess, (state, { data }) =>
      data
        ? OrganisationAdapter.upsertMany(data.items, {
            ...state,
            table: {
              total: data.total,
              ids: data.items.map((item) => item.id!) ?? [],
            },
          })
        : { ...state },
    ),

    on(
      OrganisationsActions.liveAddToShortlist,

      (state, { organisationId, shortlistId, shortlistName }) => {
        return OrganisationAdapter.updateOne(
          {
            id: organisationId,
            changes: {
              shortlists: [
                ...(state.entities[organisationId]?.shortlists?.filter(
                  (sl) => sl.id !== shortlistId,
                ) || []),
                { id: shortlistId, name: shortlistName },
              ],
            },
          },
          {
            ...state,
          },
        );
      },
    ),

    on(
      OrganisationsActions.liveRemoveFromShortlist,

      (state, { organisationIds, shortlistId }) => {
        return OrganisationAdapter.updateMany(
          organisationIds.map((id) => ({
            id,
            changes: {
              shortlists: [
                ...(state.entities[id]?.shortlists?.filter(
                  (sl) => sl.id !== shortlistId,
                ) || []),
              ],
            },
          })),
          {
            ...state,
          },
        );
      },
    ),

    on(
      OrganisationsActions.getOrganisations,
      ShortlistsActions.openShortlistOrganisationsTable,
      OrganisationsActions.openOrganisationsTable,
      (state) => ({
        ...state,
        table: {
          ids: [],
          total: 0,
        },
      }),
    ),
    on(
      OrganisationsActions.getOrganisations,
      OrganisationsActions.loadMoreOrganisations,
      OrganisationsUrlActions.queryParamsChanged,
      (state) => ({
        ...state,
        loaded: false,
        error: null,
      }),
    ),
    on(OrganisationsActions.getOrganisationsSuccess, (state, { data }) =>
      OrganisationAdapter.upsertMany([...data.items], {
        ...state,
        loaded: true,
        totalRows: data.total,
        table: {
          ids: data.items.map((item) => item.id!) ?? [],
          total: data.total,
        },
      }),
    ),
    on(OrganisationsActions.loadMoreOrganisationsSuccess, (state, { data }) =>
      OrganisationAdapter.upsertMany([...data.items], {
        ...state,
        table: {
          ids: [...state.table.ids, ...data.items.map((item) => item.id!)],
          total: data.total,
        },
        loaded: true,
        totalRows: data.total,
      }),
    ),
    on(
      OrganisationsActions.getOrganisationsFailure,
      OrganisationsActions.loadMoreOrganisationsFailure,
      (state, { error }) => ({
        ...state,
        error,
        loaded: true,
      }),
    ),

    on(OrganisationsActions.createOrganisationSuccess, (state, { data }) =>
      OrganisationAdapter.addOne(data, { ...state, loaded: true }),
    ),

    on(
      OrganisationsActions.addOpportunityToOrganisation,
      (state, { id, opportunity }) =>
        id && state.entities[id]
          ? OrganisationAdapter.updateOne(
              {
                id: id,
                changes: {
                  opportunities: [
                    ...(state.entities[id]?.opportunities || []),
                    opportunity!,
                  ],
                },
              },
              {
                ...state,
                create: {
                  isLoading: false,
                },
              },
            )
          : state,
    ),

    on(OrganisationsActions.createOrganisationSharepointFolder, (state) => ({
      ...state,
      creatingSharepointFolder: true,
    })),
    on(
      OrganisationsActions.createOrganisationSharepointFolderSuccess,
      (state, { data }) =>
        data
          ? OrganisationAdapter.upsertOne(data, {
              ...state,
              creatingSharepointFolder: false,
            })
          : { ...state, creatingSharepointFolder: false },
    ),
    on(
      OrganisationsActions.createOrganisationSharepointFolderFailure,
      (state) => ({
        ...state,
        creatingSharepointFolder: false,
      }),
    ),
    on(
      OrganisationsActions.getDataWarehouseLastUpdatedSuccess,
      (state, { data }) => ({
        ...state,
        dataWarehouseLastUpdated: data,
      }),
    ),
    on(OrganisationsActions.updateOrganisation, (state) => ({
      ...state,
      updateLoading: true,
    })),

    on(OrganisationsActions.updateOrganisationFailure, (state) => ({
      ...state,
      updateLoading: false,
    })),

    on(OrganisationsActions.updateOrganisationSuccess, (state, { data }) =>
      OrganisationAdapter.updateOne(
        { id: data.id!, changes: data },
        {
          ...state,
          updateLoading: false,
        },
      ),
    ),

    //////////////////////////
    on(OrganisationsActions.updateOrganisationDescription, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, updateDescription: true },
    })),
    on(
      OrganisationsActions.updateOrganisationDescriptionSuccess,
      (state, { data }) =>
        OrganisationAdapter.updateOne(
          { id: data.id!, changes: data },
          {
            ...state,
            loadingStates: { ...state.loadingStates, updateDescription: false },
          },
        ),
    ),
    on(OrganisationsActions.updateOrganisationDescriptionFailure, (state) => ({
      ...state,
      loadingStates: { ...state.loadingStates, updateDescription: false },
    })),
  ),
  extraSelectors: ({
    selectOrganisationsState,
    selectTable,
    selectEntities,
  }) => ({
    ...OrganisationAdapter.getSelectors(selectOrganisationsState),
    selectTableOrganisations: createSelector(
      selectTable,
      selectEntities,
      (table, entities) => table.ids.map((id) => entities[id]!),
    ),
    selectOrganisation: createSelector(
      selectOrganisationsState,
      routerQuery.selectCurrentOrganisationId,
      (state, id) => {
        const org = state.entities[id!];
        return org
          ? { ...org, opportunities: org.opportunities.filter(Boolean) }
          : null;
      },
    ),
    selectCurrentOrganisation: createSelector(
      routerQuery.selectCurrentOrganisationId,
      selectOrganisationsState,
      (companyId, organisations) => {
        if (!companyId) return null;

        const org = organisations?.entities?.[companyId];
        return org
          ? { ...org, opportunities: org.opportunities.filter(Boolean) }
          : null;
      },
    ),
  }),
});
