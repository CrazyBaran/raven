import { routerQuery } from '@app/client/shared/util-router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  OpportunitiesState,
  opportunitiesAdapter,
  opportunitiesFeatureKey,
} from './opportunities.reducer';

export const { selectAll, selectEntities } =
  opportunitiesAdapter.getSelectors();

export const selectOpportunitiesState =
  createFeatureSelector<OpportunitiesState>(opportunitiesFeatureKey);

export const selectAllOpportunities = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => selectAll(state),
);

export const selectIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.isLoading,
);

export const selectOpportunitiesDictionary = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => selectEntities(state),
);

export const selectRouteOpportunityDetails = createSelector(
  selectOpportunitiesDictionary,
  routerQuery.selectCurrentOpportunityId,
  (opportunities, opportunityId) => {
    const opportunity = opportunities?.[opportunityId ?? ''] || {};
    return {
      ...opportunity,

      team: [
        {
          id: 'key_management',
          title: 'Key Management',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'positives',
          title: 'Positives',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'risks',
          title: 'Risks',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
      ],

      marketing: [
        {
          id: 'description',
          title: 'Description',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'tam',
          title: 'TAM / SAM Sizing',
          value: '',
        },
        {
          id: 'positives',
          title: 'Positives',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
      ],
      product: [
        {
          id: 'description',
          title: 'Description',
          value: '',
        },
        {
          id: 'positive',
          title: 'Positives',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'risks',
          title: 'Risks',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
      ],
      business: [
        {
          id: 'business',
          title: 'Business Model Description',
          value: '',
        },
        {
          id: 'gtm',
          title: 'GTM Description',
          value: '',
        },
        {
          id: 'Positives',
          title: 'positives',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
      ],
      competitive: [
        {
          id: 'key_competitors',
          title: 'Key Competitors',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'positives',
          title: 'Positives',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
        {
          id: 'risks',
          title: 'Risks',
          value:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl. Sed vitae nulla euismod, aliquam nisl quis, aliquet nisl.',
        },
      ],
    };
  },
);

export const opportunitiesQuery = {
  selectAllOpportunities,
  selectIsLoading,
  selectOpportunitiesDictionary,
  selectRouteOpportunityDetails,
};
