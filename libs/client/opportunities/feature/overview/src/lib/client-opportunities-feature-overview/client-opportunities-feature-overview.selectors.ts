import { authQuery } from '@app/client/core/auth';
import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const selectOpportunityOverviewTeam = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  authQuery.selectUserEmail,
  opportunitiesQuery.selectOpportunityUpdateIsLoading,
  (opportunity, userEmail, updateTeamLoading) => {
    if (!opportunity || !opportunity.team)
      return {
        hasTeam: false,
        canEditTeam: false,
        team: [],
      };

    return {
      hasTeam:
        opportunity.team?.owners?.length || opportunity.team?.members?.length,
      canEditTeam:
        !opportunity.team.owners?.length ||
        opportunity.team.owners?.some(
          (owner) => owner.actorEmail === userEmail,
        ),
      team: [
        {
          dealLeads: opportunity?.dealLeads,

          dealTeam: opportunity?.dealTeam.map((name) => ({
            name,
          })),
        },
      ],
      updateTeamLoading,
    };
  },
);

export const selectOpportunityOverviewViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  OrganisationsFeature.selectCurrentOrganisation,
  opportunitiesQuery.selectNoteFields,
  notesQuery.selectOpportunityNotesIsLoading,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  OrganisationsFeature.selectLoadingOrganisation,
  tagsQuery.tagsFeature.selectPeopleTags,
  selectOpportunityOverviewTeam,
  (
    opportunity,
    organisation,
    noteFields,
    isLoading,
    isLoadingOpportunity,
    isLoadingOrganisation,
    peopleTags,
    overviewTeam,
  ) => {
    return {
      details: [
        {
          label: organisation?.name,
          subLabel: organisation?.domains[0],
        },
        {
          label: opportunity?.tag?.name,
          subLabel: 'Funding Round',
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
      users: peopleTags,
      opportunity,
      ...overviewTeam,
    };
  },
);
