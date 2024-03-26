/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  OrganisationEntity,
  organisationsFeature,
} from '@app/client/organisations/state';
import { transformToThousands } from '@app/client/shared/ui-pipes';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export type OrganisationDetailsViewModel = {
  currentOrganisationId?: string;
  details: {
    label: string | number | undefined;
    subLabel: string;
    background: string;
  }[];
  name?: string;
  domain?: string;
  description?: string;
  customDescription?: string;
  descriptionUpdatedAt?: string | Date;
  isLoading: boolean;
};

export const selectOrganisationDetailsViewModel = createSelector(
  routerQuery.selectCurrentOrganisationId,
  organisationsFeature.selectLoadingOrganisation,
  organisationsFeature.selectCurrentOrganisation,
  (
    currentOrganisationId,
    isLoading,
    currentOrganisation,
  ): OrganisationDetailsViewModel => ({
    name: currentOrganisation?.name,
    domain: currentOrganisation?.domains[0],
    descriptionUpdatedAt: currentOrganisation?.customDescriptionUpdatedAt,
    description: currentOrganisation?.data?.description,
    customDescription: currentOrganisation?.customDescription,
    currentOrganisationId,
    details: getOrganisationDetailsTiles(currentOrganisation),
    isLoading,
  }),
);

export const getOrganisationDetailsTiles = (
  organisation: OrganisationEntity | undefined | null,
) => {
  const fundingRoundAmount = organisation?.data?.fundingRounds?.[0]?.amount;

  //todo: fix this to use valid value
  const enterpriseValuation = organisation?.data?.fundingRounds?.[0]?.amount;

  const numberOfEmployees = _.chain(organisation?.data?.numberOfEmployees ?? [])
    .orderBy((x) => x.observationDate)
    .first()
    ?.value()?.numberOfEmployees;

  return [
    {
      label: organisation?.data?.hq?.country,
      subLabel: 'HQ Location',
      background: 'var(--series-b-lighten-20)',
    },
    {
      label: numberOfEmployees ? `${numberOfEmployees} people` : undefined,
      subLabel: 'Employees',
      background: 'var(--series-h-lighten-20)',
    },

    {
      label: organisation?.opportunities?.length
        ? _.orderBy(
            organisation.opportunities,
            (x) => new Date(x?.createdAt ?? ''),
            'desc',
          )?.[0].tag?.name
        : undefined,
      subLabel: 'Last Funding Round',
      background: 'var(--series-g-lighten-20)',
    },
    {
      label: fundingRoundAmount
        ? `$${transformToThousands(fundingRoundAmount, 2)}`
        : undefined,
      subLabel: 'Last Funding',
      background: 'var(--series-e-lighten-20)',
    },
    {
      label: enterpriseValuation
        ? `$${transformToThousands(enterpriseValuation, 2)}`
        : undefined,
      subLabel: 'Enterprise Valuation',
      background: 'var(--series-c-lighten-20)',
    },
  ];
};
