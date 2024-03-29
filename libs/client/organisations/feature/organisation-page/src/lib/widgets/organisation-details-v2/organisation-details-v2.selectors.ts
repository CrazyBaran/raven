import { organisationsFeature } from '@app/client/organisations/state';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectOrganisationDetailsViewModel = createSelector(
  routerQuery.selectCurrentOrganisationId,
  organisationsFeature.selectLoadingOrganisation,
  organisationsFeature.selectCurrentOrganisation,
  (currentOrganisationId, isLoading, currentOrganisation) => ({
    name: currentOrganisation?.name,
    domain: currentOrganisation?.domains[0],
    descriptionUpdatedAt: currentOrganisation?.customDescriptionUpdatedAt,
    description: currentOrganisation?.data?.description,
    customDescription: currentOrganisation?.customDescription,
    currentOrganisationId,
    industryTags:
      currentOrganisation?.data?.industry?.industries?.map((i) => ({
        id: i,
        name: i,
        style: {},
        icon: 'fa-regular fa-tag',
        size: 'small' as const,
      })) ?? [],
    dealroomUrl: currentOrganisation?.data?.urls?.dealRoomUrl,
    pitchbookUrl: currentOrganisation?.data?.urls?.pitchBookUrl,
    descriptionDataSource: currentOrganisation?.data?.descriptionDataSource,
    isLoading,
    country: currentOrganisation?.data?.hq?.country,
  }),
);
