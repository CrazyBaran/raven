import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { organisationsQuery } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { CompanyStatus } from 'rvns-shared';

export const selectMoveToMetCompanyDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.moveToMetCompany),
  opportunitiesFeature.selectUpdate,
  organisationsQuery.selectCurrentOrganisation,
  pipelinesQuery.selectAllPipelineStages,
  (id, { isLoading }, currentOrganisation, pipelines) => {
    return {
      opportunityId: id,
      currentOrganisation,
      companyStatus: currentOrganisation?.companyStatus,
      isLoading,
      metPipelineId: pipelines.find(
        (stage) => stage.relatedCompanyStatus === CompanyStatus.MET,
      )?.id,
    };
  },
);
