import { notesQuery } from '@app/client/opportunities/api-notes';
import { getDealLeads, getDealTeam } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
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
  (state: OpportunitiesState) => (state ? selectAll(state) : []),
);

export const selectIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.isLoading,
);

export const selectOpportunitiesDictionary = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => (state ? selectEntities(state) : {}),
);

export const selectOpportunitiesGroupedByOrganisation = createSelector(
  selectAllOpportunities,
  (opportunities) =>
    _.groupBy(opportunities ?? [], ({ organisation }) => organisation.id),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectOpportunityById = (id: string) =>
  createSelector(selectOpportunitiesDictionary, (dictionary) => dictionary[id]);

export const selectRouteOpportunityDetails = createSelector(
  selectOpportunitiesDictionary,
  routerQuery.selectCurrentOpportunityId,
  (opportunities, opportunityId) => {
    const opportunity = opportunities?.[opportunityId ?? ''];

    return (
      (opportunity && {
        ...opportunity,
        dealLeads: getDealLeads(opportunity?.fields ?? []),
        dealTeam: getDealTeam(opportunity?.fields ?? []),
        ndaTerminationDate: opportunity?.ndaTerminationDate
          ? new Date(opportunity?.ndaTerminationDate)
          : null,
      }) ??
      null
    );
  },
);

export const selectOpportunityNoteTabs = createSelector(
  notesQuery.selectOpportunityNotes,
  selectRouteOpportunityDetails,
  (opportunityNotes, opportunity) =>
    opportunityNotes?.[0]?.noteTabs.filter(
      (tab) =>
        (tab.pipelineStages &&
          opportunity &&
          tab.pipelineStages
            .map((p) => String(_.get(p, 'id')))
            .includes(opportunity.stage.id)) ??
        [],
    ) ?? [],
);
export const selectNoteFields = createSelector(
  selectOpportunityNoteTabs,
  (tabs) =>
    _.chain(tabs)
      .map((tab) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tab.noteFieldGroups[0].noteFields.map((field: any) => ({
          id: field.id,
          title: field.name,
          value: field.value,
          tabId: tab.id,
          tabName: tab.name,
        })),
      )
      .flatMap()
      .value(),
);

export const selectOpportunityDetailsIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.details.isLoading,
);

export const opportunitiesQuery = {
  selectAllOpportunities,
  selectIsLoading,
  selectNoteFields,
  selectOpportunitiesDictionary,
  selectRouteOpportunityDetails,
  selectOpportunityById,
  selectOpportunitiesGroupedByOrganisation,
  selectOpportunityNoteTabs,
  selectOpportunityDetailsIsLoading,
};
