import { OrganisationsFeature } from '@app/client/organisations/state';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const selectOrganisationDetails = createSelector(
  OrganisationsFeature.selectCurrentOrganisation,
  (organisation) =>
    [
      {
        label: organisation?.name,
        subLabel: organisation?.domains[0],
      },
      {
        label: organisation?.opportunities?.length
          ? _.orderBy(
              organisation.opportunities,
              (x) => new Date(x?.createdAt ?? ''),
              'desc',
            )[0].tag?.name ?? ''
          : null,
        subLabel: 'Opportunity',
      },
      {
        label: '12',
        subLabel: 'Last Funding (M) (Deal Room)',
      },

      {
        label: '0.9',
        subLabel: 'MCV Score',
      },
    ].filter(({ label }) => !!label),
);

export const selectOrganisationPageViewModel = createSelector(
  OrganisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOrganisationDetails,
  OrganisationsFeature.selectLoadingOrganisation,
  (currentOrganisation, currentOrganisationId, details, isLoading) => {
    return {
      currentOrganisationId,
      currentOrganisation,
      details,
      isLoading,
      opportunities: currentOrganisation?.opportunities ?? [],
    };
  },
);
