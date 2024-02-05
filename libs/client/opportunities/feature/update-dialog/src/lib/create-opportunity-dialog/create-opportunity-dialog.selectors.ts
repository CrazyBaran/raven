import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { organisationsFeature } from '@app/client/organisations/state';
import { tagsFeature } from '@app/client/tags/state';
import { templateQueries } from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = (params: {
  opportunityId: string;
  organisationId: string;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) =>
  createSelector(
    tagsFeature.selectOpportunityTags,
    tagsFeature.selectOrganisationTags,
    tagsFeature.selectLoadingTags,
    templateQueries.selectAllWorkflowTemplates,
    opportunitiesFeature.selectUpdate,
    opportunitiesQuery.selectOpportunityDetails(params.opportunityId),
    organisationsFeature.selectEntities,
    (
      opportunityTags,
      organisationTag,
      loadingTags,
      workflowTemplates,
      updateState,
      opportunityDetails,
      organisations,
    ) => ({
      opportunityDropdown: {
        data: opportunityTags.map((t) => ({ name: t.name, id: t.id })),
        textField: 'name',
        valueField: 'id',
        isLoading: !!loadingTags.opportunity,
      },
      companyCombobox: {
        data: organisationTag.map((t) => ({
          name: t.name,
          id: t.organisationId,
        })),
        textField: 'name',
        valueField: 'id',
        isLoading: !!loadingTags.company,
        placeholder:
          organisations[params.organisationId]?.name ?? 'Select company',
      },
      templateId: workflowTemplates.find(({ isDefault }) => isDefault)?.id,
      isCreating: updateState.isLoading,
      opportunityDetails,
    }),
  );
