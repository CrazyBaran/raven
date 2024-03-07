import { organisationsFeature } from '@app/client/organisations/state';
import { createSelector } from '@ngrx/store';

export const selectOrganisationDetailsViewModel = createSelector(
  organisationsFeature.selectCurrentOrganisation,
  organisationsFeature.selectLoadingOrganisation,
  (currentOrganisation, isLoading) => ({
    currentOrganisation,
    isLoading,
  }),
);
