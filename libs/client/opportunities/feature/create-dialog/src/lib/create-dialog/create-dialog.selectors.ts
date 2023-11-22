import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsFeature } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  tagsFeature.selectOpportunityTags,
  tagsFeature.selectOrganisationTags,
  tagsFeature.selectLoadingTags,
  opportunitiesFeature.selectCreate,
  selectQueryParam('opportunity-create'),
  (
    opportunityTags,
    organisationTag,
    loadingTags,
    createState,
    organisationId,
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
    },
    isCreating: createState.isLoading,
    organisationId,
  }),
);
