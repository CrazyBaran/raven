import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';

import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.reopenOpportunity),
  opportunitiesQuery.selectOpportunitiesDictionary,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  opportunitiesFeature.selectReopen,
  (id, opportunitiesDictionary, isLoading, reopenState) => {
    const opportunity = opportunitiesDictionary[id!];
    return {
      opportunityId: id,
      organisation: {
        id: opportunity?.organisation.id,
        name: opportunity?.organisation.name,
        tag: { name: opportunity?.tag?.name },
      },
      isLoading: isLoading,
      isCreating: reopenState.isLoading,
    };
  },
);
