import { opportunitiesQuery } from '@app/client/organisations/api-opportunities';
import { pipelinesQuery } from '@app/client/organisations/api-pipelines';
import { tagsFeature, tagsQuery } from '@app/client/organisations/api-tags';
import { organisationsFeature } from '@app/client/organisations/state';

import {
  FilterParam,
  OpportunityRow,
  OrganisationRowV2,
  parseToFilters,
} from '@app/client/organisations/ui';
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
  selectQueryParam,
} from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import deparam from 'jquery-deparam';

export const organisationsQueryParams = [
  'query',
  'status',
  'my',
  'round',
  'member',
  'skip',
  'take',
  'field',
  'dir',
] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  organisationsQueryParams,
  {
    skip: '0',
    take: '15',
  },
);

export const selectOrganisationsTableButtonGroupNavigation = createSelector(
  selectOrganisationsTableParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'member',
      buttons: [
        {
          id: null,
          name: 'All Companies',
        },
        {
          id: 'shortlisted',
          name: 'Shortlisted',
          iconClass: 'fa fa-star',
        },
        {
          id: userTag?.userId ?? 'unknown',
          name: 'My Companies',
          iconClass: 'fa-solid fa-circle-user',
        },
      ],
      staticQueryParams: { skip: null },
    });
  },
);

export const selectOrganisationStatusButtonGroupNavigation = createSelector(
  selectOrganisationsTableParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'status',
      buttons: [
        {
          id: null,
          name: 'All',
        },
        {
          id: 'empty',
          name: 'No Status',
        },
        {
          id: 'outreach',
          name: 'Outreach',
        },
        {
          id: 'met',
          name: 'Met',
        },
        {
          id: 'live-opportunity',
          name: 'Live Opportunity',
        },
        {
          id: 'pass',
          name: 'Pass',
        },
        {
          id: 'portfolio',
          name: 'Portfolio',
        },
      ],
      staticQueryParams: { skip: null },
    });
  },
);

export const selectOrganisationTableQueryModel = createSelector(
  selectOrganisationsTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Companies or Investors',
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
        name: 'round',
        data: opportunityData,
        defaultItem: {
          id: null,
          name: 'All Funding Rounds',
        },
        loading: loadingTags.opportunity,
      }),

      buildDropdownNavigation({
        params,
        name: 'member',
        data: peopleData,
        defaultItem: {
          id: null,
          name: 'Deal Member',
        },
        loading: loadingTags.people,
      }),
    ];
  },
);

export const selectIsLoadingOrganisationsTable = createSelector(
  organisationsFeature.selectLoaded,
  (loaded) => !loaded,
);

export const selectOrganisationRows = createSelector(
  organisationsFeature.selectAll,
  opportunitiesQuery.selectOpportunitiesDictionary,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  (organisations, groupedDictionary, stageColorDictionary) => {
    return organisations.map(
      (company): OrganisationRowV2 =>
        ({
          id: company.id!,
          name: company.name,
          domains: company.domains,
          status: {
            name: 'todo',
            color: '#000',
          },
          data: company.data,
          opportunities: company.opportunities
            .map(({ id }) => groupedDictionary[id])
            .map(
              (opportunity): OpportunityRow => ({
                id: opportunity!.id,
                companyId: company.id!,
                name: opportunity!.tag?.name ?? '',
                status: {
                  name: opportunity!.stage?.displayName ?? '',
                  color:
                    stageColorDictionary?.[opportunity!.stage?.id] ?? '#000',
                },
                dealTeam:
                  opportunity!.team?.members.map((owner) => owner.actorName) ??
                  [],
                dealLeads:
                  opportunity!.team?.owners.map((owner) => owner.actorName) ??
                  [],
                updatedAt: opportunity!.createdAt?.toString() ?? '',
              }),
            ),
        }) ?? [],
    );
  },
);

export const selectTableFilters = createSelector(
  selectQueryParam('filters'),
  (filters) => (deparam(filters ?? '') ?? {}) as Record<string, FilterParam>,
);

export const selectTableModel = createSelector(
  selectIsLoadingOrganisationsTable,
  selectOrganisationRows,
  selectOrganisationsTableParams,
  organisationsFeature.selectTotalRows,
  selectTableFilters,
  (
    isLoading,
    organisations,
    params,
    total,
    filters,
  ): TableViewModel<OrganisationRowV2> => ({
    ...params,
    isLoading,
    total,
    filters: parseToFilters(filters),
    data: organisations,
  }),
);

export const selectFilterIndicators = createSelector(
  selectTableFilters,
  (filters) => {
    return filters;
  },
);

export const selectOrganisationsTableViewModel = createSelector(
  selectOrganisationsTableButtonGroupNavigation,
  selectOrganisationsTableNavigationDropdowns,
  selectOrganisationTableQueryModel,
  selectOrganisationsTableParams,
  selectTableModel,
  organisationsFeature.selectDataWarehouseLastUpdated,
  selectFilterIndicators,
  selectOrganisationStatusButtonGroupNavigation,
  (
    buttonGroupNavigation,
    navigationDropdowns,
    queryModel,
    params,
    tableModel,
    dataWarehouseLastUpdated,
    filters,
    statuses,
  ) => {
    return {
      buttonGroupNavigation,
      navigationDropdowns,
      queryModel,
      tableModel,
      params,
      lastUpdated: dataWarehouseLastUpdated?.lastUpdated,
      lastChecked: dataWarehouseLastUpdated?.lastChecked,
      filters,
      statuses,
    };
  },
);
