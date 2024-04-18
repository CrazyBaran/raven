/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import {
  organisationStatusColorDictionary,
  organisationsFeature,
} from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
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
  organisationsFeature.selectDataWarehouseLastUpdated,
  pipelinesQuery.selectAllPipelineStages,
  (
    currentOrganisation,
    currentOrganisationId,
    isLoading,
    updateLoading,
    { isLoading: createLoading },
    dataWarehouseLastUpdated,
    pipelines,
  ) => {
    const activeOpportunity = currentOrganisation?.opportunities.find(
      (opportunity) =>
        !opportunity.stage.isHidden && !opportunity.stage.configuration,
    );

    const companyStatusDisplayName = currentOrganisation?.companyStatus
      ?.split('_')
      .join(' ');

    const status = {
      name: companyStatusDisplayName,
      subName:
        currentOrganisation?.companyStatus === CompanyStatus.LIVE_OPPORTUNITY
          ? activeOpportunity?.stage.displayName
          : undefined,
      color:
        organisationStatusColorDictionary[
          currentOrganisation?.companyStatus as CompanyStatus
        ],
    };

    return {
      currentOrganisationId,
      currentOrganisation,
      isLoading,
      status,
      createLoading,
      updateLoading,
      opportunityId: activeOpportunity?.id,
      showShortlistButton:
        currentOrganisation?.companyStatus !== CompanyStatus.PORTFOLIO,
      showStatus: !!status.name,
      showPassButton: ![CompanyStatus.PASSED, CompanyStatus.PORTFOLIO].some(
        (status) => status === currentOrganisation?.companyStatus,
      ),
      showOutreachButton:
        !currentOrganisation?.companyStatus ||
        currentOrganisation?.companyStatus === CompanyStatus.PASSED,
      showMetButton:
        currentOrganisation?.companyStatus === CompanyStatus.OUTREACH,
      showOpportunityButton:
        !currentOrganisation?.companyStatus ||
        [
          CompanyStatus.OUTREACH,
          CompanyStatus.MET,
          CompanyStatus.PASSED,
        ].includes(currentOrganisation?.companyStatus),
      shortlistQueryParam: {
        [DialogUtil.queryParams.addToShortlist]: currentOrganisation?.id,
      },
      passQueryParams: {
        [DialogUtil.queryParams.passCompany]: currentOrganisation?.id,
      },
      outreachQueryParam: {
        [DialogUtil.queryParams.moveToOutreachCompany]: currentOrganisation?.id,
      },
      opportunityQueryParam:
        currentOrganisation?.companyStatus &&
        [CompanyStatus.OUTREACH, CompanyStatus.MET].includes(
          currentOrganisation?.companyStatus,
        )
          ? null
          : {
              [DialogUtil.queryParams.createOpportunity]:
                currentOrganisation?.id,
            },
      metQueryParam: {
        [DialogUtil.queryParams.moveToMetCompany]: activeOpportunity?.id,
      },
      preliminaryStageId: pipelines.find(
        (stage) => stage.displayName === 'Preliminary DD - In progress',
      )?.id,
      lastChecked: dataWarehouseLastUpdated?.lastChecked ?? new Date(),
    };
  },
);
