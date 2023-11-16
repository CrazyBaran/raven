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
  });

export const OrganisationsFeature = createFeature({
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
  ),
  extraSelectors: ({ selectOrganisationsState }) => ({
    ...OrganisationAdapter.getSelectors(selectOrganisationsState),
    selectCurrentOrganisation: createSelector(
      routerQuery.selectCurrentOrganisationId,
      selectOrganisationsState,
      (companyId, organisations) =>
        companyId ? organisations?.entities?.[companyId] : null,
    ),
  }),
});
