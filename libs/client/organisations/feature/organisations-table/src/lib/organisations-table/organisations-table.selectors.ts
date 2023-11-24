import { authQuery } from '@app/client/core/auth';
import { opportunitiesQuery } from '@app/client/organisations/api-opportunities';
import { pipelinesQuery } from '@app/client/organisations/api-pipelines';
import { tagsFeature } from '@app/client/organisations/api-tags';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { OrganisationRow } from '@app/client/organisations/ui';
import { TableViewModel } from '@app/client/shared/ui-directives';
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
  organisationsQueryParams,
} from './organisations-table.models';

export const selectOrganisationsTableParams = buildPageParamsSelector(
  organisationsQueryParams,
  defaultOrganisationQuery,
);

export const selectCurrentUserTag = createSelector(
  authQuery.selectUserName,
  tagsFeature.selectPeopleTags,
  (name, tags) => tags.find((t) => t.name === name),
);

export const selectOrganisationsTableButtonGroupNavigation = createSelector(
  selectOrganisationsTableParams,
  selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    debugger;
    return buildButtonGroupNavigation({
      params,
      name: 'lead',
      buttons: [
        {
          id: null,
          name: 'All deals',
        },
        {
          id: userTag?.userId ?? 'unknown',
          name: 'My deals',
        },
      ],
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
      id: t.userId,
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
          stageColor: opportunity
            ? stageColorDictionary?.[opportunity.stage?.id] ?? '#000'
            : '#000',
        })),
    }));
  },
);

export const selectTableModel = createSelector(
  selectIsLoadingOrganisationsTable,
  selectOrganisationRows,
  selectOrganisationsTableParams,
  OrganisationsFeature.selectTotalRows,
  (
    isLoading,
    organisations,
    params,
    total,
  ): TableViewModel<OrganisationRow> => ({
    ...params,
    isLoading,
    total,
    data: organisations,
  }),
);

export const selectOrganisationsTableViewModel = createSelector(
  selectOrganisationsTableButtonGroupNavigation,
  selectOrganisationsTableNavigationDropdowns,
  selectOrganisationTableQueryModel,
  selectOrganisationsTableParams,
  selectTableModel,

  (
    buttonGroupNavigation,
    navigationDropdowns,
    queryModel,
    params,
    tableModel,
  ) => ({
    buttonGroupNavigation,
    navigationDropdowns,
    queryModel,
    tableModel,
    params,
  }),
);
