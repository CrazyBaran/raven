import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { OrganisationsActions } from './organisations.actions';
import { OrganisationEntity } from './organisations.model';

export interface OrganisationsState extends EntityState<OrganisationEntity> {
  loaded: boolean | null;
  error: string | null;
}

export const OrganisationAdapter: EntityAdapter<OrganisationEntity> =
  createEntityAdapter<OrganisationEntity>();

export const initialOrganisationState: OrganisationsState =
  OrganisationAdapter.getInitialState({
    loaded: false,
    error: null,
    selectedId: null,
  });

export const OrganisationsFeature = createFeature({
  name: 'organisations',
  reducer: createReducer(
    initialOrganisationState,
    on(OrganisationsActions.getOrganisations, (state) => ({
      ...state,
      loaded: false,
      error: null,
    })),
    on(OrganisationsActions.getOrganisationsSuccess, (state, { data }) =>
      OrganisationAdapter.setAll([...data], { ...state, loaded: true }),
    ),
    on(OrganisationsActions.getOrganisationsFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(OrganisationsActions.createOrganisationSuccess, (state, { data }) =>
      OrganisationAdapter.addOne(data, { ...state, loaded: true }),
    ),
  ),
  extraSelectors: ({ selectOrganisationsState }) => ({
    ...OrganisationAdapter.getSelectors(selectOrganisationsState),
  }),
});
