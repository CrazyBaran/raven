import { StatusIndicatorComponent } from '@app/client/opportunities/ui';

import { opportunitiesQuery } from '@app/client/opportunities/data-access';

import { OrganisationsFeature } from '@app/client/organisations/state';
import { routerQuery, selectUrl } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

const opportunity = {
  team: {
    dealLead: {},
    dealTeam: [],
  },
  details: {} as Record<string, unknown>,
  missingDetails: [
    {
      tab: 'team',
      field: 'risks',
      action: 'Please fill this field to advance',
    },
  ],
};

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
    queryParams: { type: null },
  },
  { label: 'Files', link: 'files', queryParams: { type: null } },
  { label: 'Notes', link: 'notes', queryParams: { type: null } },
  { label: 'Team', link: 'related-notes', queryParams: { type: 'team' } },
  {
    label: 'Marketing',
    link: 'related-notes',
    queryParams: { type: 'marketing' },
  },
  {
    label: 'Product & technology',
    link: 'related-notes',
    queryParams: { type: 'product' },
  },
  {
    label: 'Business Model / GTM',
    link: 'related-notes',
    queryParams: { type: 'business' },
  },
  { label: 'Financials', link: 'financials', queryParams: { type: null } },
];

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
  routerQuery.selectActiveType,
  (url, activeType) => {
    const activeNavigation = OPPORTUNITY_DETAILS_ROUTES.find((r) => {
      return (
        url.includes(r.link) &&
        (!activeType || r.queryParams?.type === activeType)
      );
    });

    return OPPORTUNITY_DETAILS_ROUTES.map((nav) => ({
      ...nav,
      active: nav.label === activeNavigation?.label,
    }));
  },
);

export const selectOpportunityDetailViewModel = createSelector(
  routerQuery.selectCurrentOpportunityId,
  opportunitiesQuery.selectRouteOpportunityDetails,
  OrganisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOpportunityPipelines,
  selectOpportunityPageNavigation,
  (
    opportunityId,
    opportunityDetails,
    currentOrganisation,
    currentOrganisationId,
    lines,
    navigations,
  ) => {
    return {
      opportunityId,
      opportunityDetails,
      currentOrganisationId,
      currentOrganisation,
      lines,
      details: [
        {
          label: 'Curvestone',
          subLabel: 'Curvestone.io',
        },
        {
          label: 'Series B',
          subLabel: 'Opportunity',
        },
        {
          label: 'Virgile Audi',
          subLabel: 'Deal Lead',
        },
        {
          label: 'March 27, 2023',
          subLabel: 'Last Contact',
        },
      ],
      navigations,
    };
  },
);
