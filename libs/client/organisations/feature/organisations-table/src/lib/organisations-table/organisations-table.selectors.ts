import { opportunitiesQuery } from '@app/client/organisations/api-opportunities';
import { pipelinesQuery } from '@app/client/organisations/api-pipelines';
import { tagsFeature } from '@app/client/organisations/api-tags';
import { OrganisationsFeature } from '@app/client/organisations/state';
import {
  ButtongroupNavigationModel,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
  buildInputNavigation,
  buildPageParamsSelector,
} from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import {
  defaultOrganisationQuery,
  organisationTableNavigationButtons,
  organisationsQueryParams,
} from './organisations-table.models';

export const selectOrganisationsTableParams = buildPageParamsSelector(
  organisationsQueryParams,
  defaultOrganisationQuery,
);

export const selectOrganisationsTableButtonGroupNavigation = createSelector(
  selectOrganisationsTableParams,
  (params): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'my',
      buttons: organisationTableNavigationButtons,
    });
  },
);

export const selectOrganisationTableQueryModel = createSelector(
  selectOrganisationsTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Companies',
    }),
);

export const selectOrganisationsTableNavigationDropdowns = createSelector(
  selectOrganisationsTableParams,
  tagsFeature.selectOpportunityTags,
  tagsFeature.selectPeopleTags,
  tagsFeature.selectLoadingTags,
  (
    params,
    opportunityTags,
    peopleTags,
    loadingTags,
  ): DropdownNavigationModel[] => {
    const opportunityData = opportunityTags.map((t) => ({
      name: t.name,
      id: t.id,
    }));

    const peopleData = peopleTags.map((t) => ({
      name: t.name,
      id: t.id,
    }));

    return [
      buildDropdownNavigation({
        params,
        name: 'opportunity',
        data: opportunityData,
        defaultItem: {
          id: null,
          name: 'Any Opportunity',
        },
        loading: loadingTags.opportunity,
      }),

      buildDropdownNavigation({
        params,
        name: 'lead',
        data: peopleData,
        defaultItem: {
          id: null,
          name: 'Any Deal Lead',
        },
        loading: loadingTags.people,
      }),
    ];
  },
);

export const selectIsLoadingOrganisationsTable = createSelector(
  OrganisationsFeature.selectLoaded,
  (loaded) => !loaded,
);

export const selectOrganisationRows = createSelector(
  OrganisationsFeature.selectAll,
  opportunitiesQuery.selectOpportunitiesDictionary,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  (organisations, groupedDictionary, stageColorDictionary) => {
    return organisations.map((o) => ({
      ...o,
      opportunities: o.opportunities
        .map(({ id }) => groupedDictionary[id])
        .map((opportunity) => ({
          ...opportunity,
          stageColor: stageColorDictionary?.[opportunity!.stage?.id] ?? '#000',
          tag: null,
        })),
    }));
  },
);

export const selectOrganisationsTableViewModel = createSelector(
  selectOrganisationsTableButtonGroupNavigation,
  selectOrganisationsTableNavigationDropdowns,
  selectIsLoadingOrganisationsTable,
  selectOrganisationRows,
  selectOrganisationTableQueryModel,
  selectOrganisationsTableParams,
  OrganisationsFeature.selectTotalRows,
  (
    buttonGroupNavigation,
    navigationDropdowns,
    isLoading,
    organisations,
    queryModel,
    query,
    total,
  ) => ({
    buttonGroupNavigation,
    navigationDropdowns,
    isLoading,
    organisations,
    queryModel,
    query,
    total,
  }),
);
