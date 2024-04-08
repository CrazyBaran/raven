import {
  opportunitiesFeature,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { organisationsFeature } from '@app/client/organisations/state';
import { tagsFeature } from '@app/client/tags/state';
import { templateQueries } from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  tagsFeature.selectOpportunityTags,
  tagsFeature.selectOrganisationTags,
  tagsFeature.selectLoadingTags,
  templateQueries.selectAllWorkflowTemplates,
  opportunitiesFeature.selectUpdate,
  opportunitiesQuery.selectRouteOpportunityDetails,
  organisationsFeature.selectCurrentOrganisation,
  (
    opportunityTags,
    organisationTag,
    loadingTags,
    workflowTemplates,
    updateState,
    opportunityDetails,
    organisation,
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
      placeholder: organisation?.name ?? 'Select company',
    },
    templateId: workflowTemplates.find(({ isDefault }) => isDefault)?.id,
    isCreating: updateState.isLoading,
    opportunityDetails,
  }),
);
