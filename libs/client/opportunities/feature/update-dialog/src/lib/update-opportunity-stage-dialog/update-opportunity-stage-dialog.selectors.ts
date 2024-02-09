import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectUpdateOpportunityStageViewModel = createSelector(
  selectQueryParam(DialogQueryParams.updateOpportunityStage),
  opportunitiesQuery.selectOpportunitiesDictionary,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  opportunitiesFeature.selectUpdateStage,
  pipelinesQuery.selectAllPipelineStages,
  (id, opportunitiesDictionary, isLoading, updateStage, stages) => {
    const opportunity = opportunitiesDictionary[id!];
    return {
      opportunityId: id,
      organisation: {
        name: opportunity?.organisation.name,
        tag: { name: opportunity?.tag?.name },
      },
      isLoading: isLoading,
      isCreating: updateStage.isLoading,
      stages: {
        defaultItem: { displayName: 'Choose from list', value: null },
        textField: 'displayName',
        valueField: 'id',
        data: stages,
      },
    };
  },
);
