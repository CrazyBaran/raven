import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const selectOpportunityOverviewViewModel = createSelector(
  getRouterSelectors().selectQueryParams,
  opportunitiesQuery.selectRouteOpportunityDetails,
  OrganisationsFeature.selectCurrentOrganisation,
  opportunitiesQuery.selectNoteFields,
  notesQuery.selectOpportunityNotesIsLoading,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  OrganisationsFeature.selectLoadingOrganisation,
  (
    params,
    opportunity,
    organisation,
    noteFields,
    isLoading,
    isLoadingOpportunity,
    isLoadingOrganisation,
  ) => {
    return {
      details: [
        {
          label: organisation?.name,
          subLabel: organisation?.domains[0],
        },
        {
          label: opportunity?.tag?.name,
          subLabel: 'Opportunity',
        },
        {
          label: opportunity?.roundSize,
          subLabel: 'Round Size',
        },
        {
          label: opportunity?.valuation,
          subLabel: 'Valuation',
        },
        {
          label: opportunity?.proposedInvestment,
          subLabel: 'Proposed Investment',
        },
        {
          label: opportunity?.positioning
            ? _.startCase(_.toLower(opportunity.positioning))
            : null,
          subLabel: 'Positioning',
        },
        {
          label: opportunity?.timing,
          subLabel: 'Timing',
        },
        {
          label: opportunity?.underNda,
          subLabel: 'Under NDA',
        },
        {
          label:
            opportunity?.ndaTerminationDate &&
            _.isDate(new Date(opportunity.ndaTerminationDate))
              ? new Date(opportunity.ndaTerminationDate).toLocaleDateString(
                  'en-GB',
                )
              : null,
          subLabel: 'NDA Termination Date',
        },
      ].filter(({ label }) => !!label),
      hasTeam:
        !!opportunity?.dealTeam?.length || !!opportunity?.dealLeads?.length,
      team: [
        {
          dealLead: {
            name: opportunity?.dealLeads[0],
          },
          dealTeam: opportunity?.dealTeam.map((name) => ({
            name,
          })),
        },
      ],
      isLoading,
      isLoadingDetails: isLoadingOrganisation || isLoadingOpportunity,
      id: opportunity?.id,
      missingDetails: noteFields
        .filter(({ value }) => !value?.trim())
        .map(({ tabName, title }) => ({
          tab: tabName,
          field: title,
          action: 'Please fill field to advance',
        })),
    };
  },
);
