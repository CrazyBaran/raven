import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { OpportunityUtils } from '@app/client/opportunities/utils';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsFeature } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectUpdateOpportunityStageViewModel = createSelector(
  selectQueryParam(DialogQueryParams.updateOpportunityStage),
  opportunitiesQuery.selectOpportunitiesDictionary,
  opportunitiesQuery.selectOpportunityDetailsIsLoading,
  opportunitiesFeature.selectUpdate,
  pipelinesQuery.selectAllPipelineStages,
  tagsFeature.selectOpportunityTags,
  (
    id,
    opportunitiesDictionary,
    isLoading,
    updateStage,
    stages,
    opportunityTags,
  ) => {
    const opportunity = opportunitiesDictionary[id!];
    return {
      opportunityId: id,
      organisation: {
        id: opportunity?.organisation.id,
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
        itemDisabled: OpportunityUtils.getDisabledItemFn(opportunity?.stage.id),
      },
      opportunityDropdown: {
        data: opportunityTags.map((t) => ({ name: t.name, id: t.id })),
        textField: 'name',
        valueField: 'id',
        defaultItem: {
          name: opportunity?.tag?.name || 'Choose round',
          id: opportunity?.tag?.id,
        },
      },
      disabledOpportunityDropdown: !!opportunity?.tag?.id,
    };
  },
);
