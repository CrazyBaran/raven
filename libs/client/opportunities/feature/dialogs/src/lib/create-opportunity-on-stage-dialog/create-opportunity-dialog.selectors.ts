/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { tagsFeature, tagsQuery } from '@app/client/tags/state';
import { templateQueries } from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = (params: {
  opportunityId: string;
  organisationId: string;
}) =>
  createSelector(
    tagsFeature.selectOpportunityTags,
    tagsQuery.selectPeopleTags,
    tagsFeature.selectLoadingTags,
    templateQueries.selectAllWorkflowTemplates,
    opportunitiesFeature.selectUpdate,
    opportunitiesQuery.selectOpportunityDetails(params.opportunityId),
    (
      opportunityTags,
      people,
      loadingTags,
      workflowTemplates,
      updateState,
      opportunityDetails,
    ) => ({
      opportunityDropdown: {
        data: opportunityTags.map((t) => ({ name: t.name, id: t.id })),
        isLoading: !!loadingTags.opportunity,
      },
      templateId: workflowTemplates.find(({ isDefault }) => isDefault)?.id,
      isCreating: updateState.isLoading,
      opportunityDetails,
      people,
      organisation: opportunityDetails?.organisation,
      hasTeam: !!opportunityDetails?.team?.owners?.length,
    }),
  );
