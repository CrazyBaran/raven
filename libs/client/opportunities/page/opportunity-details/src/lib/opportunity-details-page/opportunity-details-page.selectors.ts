import { opportunitiesQuery } from '@app/client/opportunities/data-access';

import { notesQuery } from '@app/client/opportunities/api-notes';
import { PipelineUtils } from '@app/client/opportunities/api-pipelines';
import { OpportunityUtils } from '@app/client/opportunities/utils';
import { organisationsFeature } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { routerQuery, selectUrl } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { OpportunityData } from '../../../../../../../rvns-opportunities/src';
import { getOpportunityName } from '../../../../../../shared/util/src';

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

export const selectOpportunityStage = createSelector(
  pipelinesQuery.selectAllPipelineStages,
  opportunitiesQuery.selectRouteOpportunityDetails,
  (stages, opportunity) => {
    return stages.find(({ id }) => id === opportunity?.stage.id);
  },
);

export const selectOpportunityPipelines = createSelector(
  pipelinesQuery.selectAllPipelineStages,
  pipelinesQuery.selectIsLoading,
  opportunitiesQuery.selectRouteOpportunityDetails,
  opportunitiesQuery.selectHasPermissionForCurrentOpportunity,
  opportunitiesQuery.selectIsLoadingUpdateStage,
  selectOpportunityStage,
  (
    stages,
    isLoading,
    opportunity,
    hasPermission,
    isLoadingUpdateState,
    stage,
  ) => ({
    data: stages.filter(
      ({ isHidden, order }) => !isHidden && order > PipelineUtils.metStageOrder,
    ),
    value: isLoading ? null : opportunity?.stage.id,
    disabled: isLoading || isLoadingUpdateState,
    isLoading: isLoading || isLoadingUpdateState,
    disabledItem: OpportunityUtils.getDisabledItemFn(opportunity?.stage.id),
    hasConfiguration: !!stage?.configuration,
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
        label: getOpportunityName(opportunity as OpportunityData),
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
      lines: lines,
      details,
      navigations,
      affinityUrl: opportunityDetails?.organisation?.affinityUrl,
      ...loadingState,
    };
  },
);
