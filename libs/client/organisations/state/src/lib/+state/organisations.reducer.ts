import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { routerQuery } from '@app/client/shared/util-router';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from './organisations.actions';
import { OrganisationEntity } from './organisations.model';

export interface OrganisationsState extends EntityState<OrganisationEntity> {
  totalRows: number;
  loaded: boolean | null;
  error: string | null;
  loadingOrganisation: boolean;
  creatingSharepointFolder: boolean;
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
  });

export const organisationsFeature = createFeature({
  name: 'organisations',
  reducer: createReducer(
    initialOrganisationState,

    on(OrganisationsActions.getOrganisation, (state) => ({
      ...state,
      loadingOrganisation: true,
      error: null,
    })),
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

    on(
      OrganisationsActions.getOrganisations,
      OrganisationsUrlActions.queryParamsChanged,
      (state) => ({
        ...state,
        loaded: false,
        error: null,
      }),
    ),
    on(OrganisationsActions.getOrganisationsSuccess, (state, { data }) =>
      OrganisationAdapter.setAll([...data.items], {
        ...state,
        loaded: true,
        totalRows: data.total,
      }),
    ),
    on(OrganisationsActions.getOrganisationsFailure, (state, { error }) => ({
      ...state,
      error,
      loaded: true,
    })),

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
      (state, { error }) => ({
        ...state,
        creatingSharepointFolder: false,
      }),
    ),
  ),
  extraSelectors: ({ selectOrganisationsState }) => ({
    ...OrganisationAdapter.getSelectors(selectOrganisationsState),
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
