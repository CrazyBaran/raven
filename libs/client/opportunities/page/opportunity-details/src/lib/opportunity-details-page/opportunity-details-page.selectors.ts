import { opportunitiesQuery } from '@app/client/opportunities/data-access';

import { notesQuery } from '@app/client/notes/data-access';
import { organisationsFeature } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { routerQuery, selectUrl } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

const OPPORTUNITY_DETAILS_ROUTES = [
  {
    label: 'Overview',
    link: 'overview',
    queryParams: { tab: null },
  },
  { label: 'Files', link: 'files', queryParams: { tab: null } },
  {
    label: 'Notes',
    link: 'notes',
    queryParams: { tab: null },
    style: {
      'border-bottom': '1px solid rgba(0, 44, 60, 0.08) !important',
      'margin-bottom': '0.5em',
    },
  },
];

export const selectDynamicOpportunityTabs = createSelector(
  opportunitiesQuery.selectOpportunityNoteTabs,
  (opportunityNotes) =>
    opportunityNotes.map((tab) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({
        label: tab.name,
        link: 'related-notes',
        queryParams: { tab: tab.name },
      }),
    ),
);

export const selectOpportunityPipelines = createSelector(
  pipelinesQuery.selectAllPipelineStages,
  pipelinesQuery.selectIsLoading,
  opportunitiesQuery.selectRouteOpportunityDetails,
  opportunitiesQuery.selectHasPermissionForCurrentOpportunity,
  opportunitiesQuery.selectIsLoadingUpdateStage,
  (stages, isLoading, opportunity, hasPermission, isLoadingUpdateState) => ({
    data: stages,
    value: opportunity?.stage.id,
    disabled: isLoading || isLoadingUpdateState, // todo: add permission check
    isLoading: isLoading || isLoadingUpdateState,
  }),
);

export const selectOpportunityPageNavigation = createSelector(
  selectUrl,
  routerQuery.selectActiveTab,
  selectDynamicOpportunityTabs,
  (url, activeType, dynamicTabs) => {
    return [...OPPORTUNITY_DETAILS_ROUTES, ...dynamicTabs].map((nav) => ({
      ...nav,
      active:
        url.includes(nav.link) &&
        (!activeType || nav.queryParams?.tab === activeType),
    }));
  },
);
export const selectOpportunityDetails = createSelector(
  organisationsFeature.selectCurrentOrganisation,
  opportunitiesQuery.selectRouteOpportunityDetails,
  (organisation, opportunity) =>
    [
      {
        label: organisation?.name,
        subLabel: organisation?.domains[0],
      },
      {
        label: opportunity?.tag?.name ?? '',
        subLabel: 'Opportunity',
      },
      {
        label: opportunity?.dealLeads[0] ?? '',
        subLabel: 'Deal Lead',
      },
      {
        label: '',
        subLabel: 'Last Contact',
      },
    ].filter(({ label }) => !!label),
);

export const selectOpportunityPageLoadingState = createSelector(
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  notesQuery.selectOpportunityNotesIsLoading,
  organisationsFeature.selectLoadingOrganisation,
  opportunitiesQuery.selectIsLoadingUpdateStage,
  (
    opportunityIsLoading,
    notesIsLoading,
    organisationIsLoading,
    updatingPipeline,
  ) => ({
    opportunityIsLoading,
    notesIsLoading,
    organisationIsLoading,
    updatingPipeline,
  }),
);

export const selectOpportunityDetailViewModel = createSelector(
  routerQuery.selectCurrentOpportunityId,
  opportunitiesQuery.selectRouteOpportunityDetails,
  organisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOpportunityPipelines,
  selectOpportunityPageNavigation,
  selectOpportunityDetails,
  selectOpportunityPageLoadingState,
  (
    opportunityId,
    opportunityDetails,
    currentOrganisation,
    currentOrganisationId,
    lines,
    navigations,
    details,
    loadingState,
  ) => {
    return {
      opportunityId,
      opportunityDetails,
      currentOrganisationId,
      currentOrganisation,
      lines,
      details,
      navigations,
      affinityUrl: opportunityDetails?.organisation?.affinityUrl,
      ...loadingState,
    };
  },
);
