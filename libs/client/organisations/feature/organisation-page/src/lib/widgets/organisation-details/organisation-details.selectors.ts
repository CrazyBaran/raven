/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { organisationsFeature } from '@app/client/organisations/state';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const selectOrganisationDetails = createSelector(
  organisationsFeature.selectCurrentOrganisation,
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
        subLabel: 'Last Instrument',
      },
    ].filter(({ label }) => !!label),
);

export const selectOrganisationDetailsViewModel = createSelector(
  routerQuery.selectCurrentOrganisationId,
  selectOrganisationDetails,
  organisationsFeature.selectLoadingOrganisation,
  (currentOrganisationId, details, isLoading) => ({
    currentOrganisationId,
    details,
    isLoading,
  }),
);
