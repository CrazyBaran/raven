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
  details: {
    isLoading: boolean;
  };
  create: {
    isLoading: boolean;
  };
  update: {
    isLoading: boolean;
  };
  updateTeam: {
    isLoading: boolean;
  };
  updateStage: {
    isLoading: boolean;
  };
  reopen: {
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
    details: {
      isLoading: false,
    },
    updateTeam: {
      isLoading: false,
    },
    updateStage: {
      isLoading: false,
    },
    reopen: {
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

  on(
    OrganisationsActions.getOrganisationsSuccess,
    OrganisationsActions.loadMoreOrganisationsSuccess,
    (state, { data }) =>
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

  on(OpportunitiesActions.changeOpportunityPipelineStage, (state) => ({
    ...state,
    updateStage: {
      isLoading: true,
    },
  })),

  on(
    OpportunitiesActions.changeOpportunityPipelineStageSuccess,
    (state, { data }) =>
      opportunitiesAdapter.updateOne(
        {
          id: data!.id,
          changes: {
            stage: data?.stage,
          },
        },
        { ...state, isLoading: false },
      ),
  ),

  on(OpportunitiesActions.changeOpportunityPipelineStageFailure, (state) => ({
    ...state,
    updateStage: {
      isLoading: false,
    },
  })),

  on(OpportunitiesActions.getOpportunityDetails, (state) => ({
    ...state,
    details: {
      isLoading: true,
    },
  })),
  on(OpportunitiesActions.getOpportunityDetailsSuccess, (state, { data }) => ({
    ...state,
    details: {
      isLoading: false,
    },
  })),
  on(OpportunitiesActions.getOpportunityDetailsSuccess, (state, { data }) =>
    data
      ? opportunitiesAdapter.upsertOne(data, { ...state, isLoading: false })
      : { ...state, isLoading: false },
  ),
  on(OpportunitiesActions.getOpportunityDetailsFailure, (state, { error }) => ({
    ...state,
    error,
    details: {
      isLoading: false,
    },
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

  on(OpportunitiesActions.reopenOpportunity, (state) => ({
    ...state,
    reopen: {
      isLoading: true,
    },
  })),

  on(OpportunitiesActions.reopenOpportunityFailure, (state, { error }) => ({
    ...state,
    reopen: {
      isLoading: false,
    },
  })),

  on(OpportunitiesActions.reopenOpportunitySuccess, (state, { data }) =>
    opportunitiesAdapter.updateOne(
      { id: data!.id, changes: data },
      {
        ...state,
        reopen: {
          isLoading: false,
        },
      },
    ),
  ),

  on(OpportunitiesActions.updateOpportunityTeam, (state) => ({
    ...state,
    updateTeam: {
      isLoading: true,
    },
  })),

  on(OpportunitiesActions.updateOpportunityTeamFailure, (state, { error }) => ({
    ...state,
    updateTeam: {
      isLoading: false,
    },
  })),

  on(OpportunitiesActions.updateOpportunityTeamSuccess, (state, { id, data }) =>
    opportunitiesAdapter.updateOne(
      { id: id, changes: { team: data } },
      {
        ...state,
        updateTeam: {
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
