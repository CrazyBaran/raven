import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { DialogQueryParams } from '../../../../../../shared/shelf/src/lib/shelf.effects';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogQueryParams.reopenOpportunity),
  opportunitiesQuery.selectOpportunitiesDictionary,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  opportunitiesFeature.selectReopen,
  (id, opportunitiesDictionary, isLoading, reopenState) => {
    const opportunity = opportunitiesDictionary[id!];
    return {
      opportunityId: id,
      organisation: {
        name: opportunity?.organisation.name,
        tag: { name: opportunity?.tag?.name },
      },
      isLoading: isLoading,
      isCreating: reopenState.isLoading,
    };
  },
);
