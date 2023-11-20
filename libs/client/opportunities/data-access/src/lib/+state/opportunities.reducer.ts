import { OrganisationsActions } from '@app/client/opportunities/api-organisations';
import { OpportunityData } from '@app/rvns-opportunities';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { OpportunitiesActions } from './opportunities.actions';

export const opportunitiesFeatureKey = 'opportunities';

export interface OpportunitiesState extends EntityState<OpportunityData> {
  isLoading: boolean;
  error: string | null;
  create: {
    isLoading: boolean;
  };
  update: {
    isLoading: boolean;
  };
}

export const opportunitiesAdapter: EntityAdapter<OpportunityData> =
  createEntityAdapter<OpportunityData>();

export const initialState: OpportunitiesState =
  opportunitiesAdapter.getInitialState({
    // additional entity state properties
    isLoading: false,
    error: null,
    create: {
      isLoading: false,
    },
    update: {
      isLoading: false,
    },
  });
export const opportunitiesReducer = createReducer(
  initialState,
  on(OpportunitiesActions.getOpportunities, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(OpportunitiesActions.getOpportunitiesSuccess, (state, { data }) =>
    opportunitiesAdapter.setAll(data, { ...state, isLoading: false }),
  ),

  on(OrganisationsActions.getOrganisationsSuccess, (state, { data }) =>
    opportunitiesAdapter.upsertMany(
      _.chain(data.items)
        .map((d) => d.opportunities.map((o) => ({ ...o, organisation: d })))
        .flatMap()
        .value(),
      { ...state },
    ),
  ),

  on(OpportunitiesActions.getOpportunitiesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(
    OpportunitiesActions.liveChangeOpportunityPipelineStageUpdated,
    OpportunitiesActions.changeOpportunityPipelineStage,
    (state, { pipelineStageId, id }) =>
      opportunitiesAdapter.updateOne(
        {
          id,
          changes: {
            stage: {
              ...state.entities[id]!.stage,
              id: pipelineStageId,
            },
          },
        },
        { ...state, isLoading: false },
      ),
  ),

  on(OpportunitiesActions.clearOpportunities, (state) =>
    opportunitiesAdapter.removeAll({ ...state, isLoading: false }),
  ),

  on(OpportunitiesActions.getOpportunityDetails, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(OpportunitiesActions.getOpportunityDetailsSuccess, (state, { data }) => ({
    ...state,
    details: data,
    isLoading: false,
  })),
  on(OpportunitiesActions.getOpportunityDetailsSuccess, (state, { data }) =>
    data
      ? opportunitiesAdapter.upsertOne(data, { ...state, isLoading: false })
      : { ...state, isLoading: false },
  ),
  on(OpportunitiesActions.getOpportunityDetailsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(OpportunitiesActions.clearOpportunityDetails, (state) => ({
    ...state,
    details: null,
  })),

  on(OpportunitiesActions.createOpportunity, (state) => ({
    ...state,
    create: {
      ...state.create,
      isLoading: true,
    },
  })),

  on(OpportunitiesActions.createOpportunityFailure, (state, { error }) => ({
    ...state,
    create: {
      isLoading: false,
    },
  })),

  on(OpportunitiesActions.createOpportunitySuccess, (state, { data }) =>
    opportunitiesAdapter.addOne(data, {
      ...state,
      create: {
        isLoading: false,
      },
    }),
  ),

  on(OpportunitiesActions.updateOpportunity, (state) => ({
    ...state,
    update: {
      ...state.update,
      isLoading: true,
    },
  })),

  on(OpportunitiesActions.updateOpportunityFailure, (state, { error }) => ({
    ...state,
    update: {
      isLoading: false,
    },
  })),

  on(OpportunitiesActions.updateOpportunitySuccess, (state, { data }) =>
    opportunitiesAdapter.updateOne(
      { id: data.id, changes: data },
      {
        ...state,
        update: {
          isLoading: false,
        },
      },
    ),
  ),
);

export const opportunitiesFeature = createFeature({
  name: opportunitiesFeatureKey,
  reducer: opportunitiesReducer,
  extraSelectors: ({ selectOpportunitiesState }) => ({
    ...opportunitiesAdapter.getSelectors(selectOpportunitiesState),
  }),
});
