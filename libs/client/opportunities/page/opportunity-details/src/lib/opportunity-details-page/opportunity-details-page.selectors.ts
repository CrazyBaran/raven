import { StatusIndicatorComponent } from '@app/client/opportunities/ui';

import { opportunitiesQuery } from '@app/client/opportunities/data-access';

import { notesQuery } from '@app/client/notes/data-access';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { routerQuery, selectUrl } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const LINES: {
  label: string;
  theme: StatusIndicatorComponent['theme'];
}[] = [
  { label: 'Contacted', theme: 'blue' },
  { label: 'Met', theme: 'orange' },
  { label: 'DD', theme: 'purple' },
  { label: 'Socialised', theme: 'yellow' },
  { label: 'Prep for IC', theme: 'red' },
];

const OPPORTUNITY_DETAILS_ROUTES = [
  {
    label: 'Opportunity Overview',
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
  notesQuery.selectOpportunityNotes,
  (opportunityNotes) =>
    _.chain(opportunityNotes)
      .map(
        ({ noteTabs }) =>
          noteTabs?.map(({ id, name }) => ({
            label: name,
            link: 'related-notes',
            queryParams: { tab: id },
          })) ?? [],
      )
      .flatMap()

      .value(),
);

export const selectOpportunityPipelines = createSelector(
  routerQuery.selectActiveLine,
  (activeLine) =>
    LINES.map(({ label, theme }) => ({
      label,
      theme,
      state: <StatusIndicatorComponent['state']>(
        ((activeLine ?? LINES[0].label) === label ? 'active' : 'inactive')
      ),
    })),
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
  OrganisationsFeature.selectCurrentOrganisation,
  opportunitiesQuery.selectRouteOpportunityDetails,
  (organisation, opportunity) => [
    {
      label: organisation?.name,
      subLabel: organisation?.domains[0],
    },
    {
      label: opportunity?.tag?.name ?? 'Unknown',
      subLabel: 'Opportunity',
    },
    {
      label: opportunity?.dealLeads[0] ?? '',
      subLabel: 'Deal Lead',
    },
    {
      label: 'Unknown',
      subLabel: 'Last Contact',
    },
  ],
);

export const selectOpportunityDetailViewModel = createSelector(
  routerQuery.selectCurrentOpportunityId,
  opportunitiesQuery.selectRouteOpportunityDetails,
  OrganisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOpportunityPipelines,
  selectOpportunityPageNavigation,
  notesQuery.selectOpportunityNotesIsLoading,
  selectOpportunityDetails,
  (
    opportunityId,
    opportunityDetails,
    currentOrganisation,
    currentOrganisationId,
    lines,
    navigations,
    isLoadingNotes,
    details,
  ) => {
    return {
      opportunityId,
      opportunityDetails,
      currentOrganisationId,
      currentOrganisation,
      lines,
      details,
      navigations,
      isLoadingNotes,
    };
  },
);
