/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import {
  organisationStatusColorDictionary,
  organisationsFeature,
} from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { CompanyStatus } from 'rvns-shared';

export const selectOrganisationPageViewModel = createSelector(
  organisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  organisationsFeature.selectLoadingOrganisation,
  organisationsFeature.selectUpdateLoading,
  opportunitiesFeature.selectCreate,
  (
    currentOrganisation,
    currentOrganisationId,
    isLoading,
    updateLoading,
    { isLoading: createLoading },
  ) => {
    const companyStatusDisplayName = currentOrganisation?.companyStatus
      ?.split('_')
      .join(' ');

    const status = {
      name: companyStatusDisplayName,
      color:
        organisationStatusColorDictionary[
          currentOrganisation?.companyStatus as CompanyStatus
        ],
    };

    return {
      currentOrganisationId,
      currentOrganisation,
      status,
      createLoading,
      updateLoading,
      showPassButton:
        ![CompanyStatus.PASSED, CompanyStatus.PORTFOLIO].some(
          (status) => status === currentOrganisation?.companyStatus,
        ) && !isLoading,
      showStatus: !isLoading && companyStatusDisplayName,
      showOutreachButton: !isLoading && !currentOrganisation?.companyStatus,
      outreachQueryParam: {
        [DialogUtil.queryParams.moveToOutreachCompany]: currentOrganisation?.id,
      },
      addToShortlistQueryParam: {
        [DialogUtil.queryParams.addToShortlist]: currentOrganisation?.id,
      },
    };
  },
);
