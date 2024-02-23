import { opportunitiesQuery } from '@app/client/organisations/api-opportunities';
import { pipelinesQuery } from '@app/client/organisations/api-pipelines';
import { tagsQuery } from '@app/client/organisations/api-tags';
import {
  organisationStatusColorDictionary,
  organisationsFeature,
} from '@app/client/organisations/state';

import {
  FilterParam,
  OpportunityRow,
  OrganisationRowV2,
  OrganisationTableBulkAction,
  parseToFilters,
} from '@app/client/organisations/ui';

import { TableViewModel } from '@app/client/shared/ui-directives';
import {
  ButtongroupNavigationModel,
  DropdownAction,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
  buildPageParamsSelector,
  selectQueryParam,
  selectRouteParam,
} from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { OpportunityData } from '@app/rvns-opportunities';
import { createSelector } from '@ngrx/store';
import deparam from 'jquery-deparam';
import { CompanyStatus } from 'rvns-shared';

export const shortlistOrganisationsQueryParams = [
  'query',
  'status',
  'my',
  'round',
  'member',
  'skip',
  'take',
  'field',
  'dir',
  'filters',
  'shortlistId',
] as const;

export const selectShortlistOrganisationsTableParams = buildPageParamsSelector(
  shortlistOrganisationsQueryParams,
  {
    skip: '0',
    take: '25',
  },
);

export const selectShortlistOrganisationsTableButtonGroupNavigation =
  createSelector(
    selectShortlistOrganisationsTableParams,
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
            id: userTag?.userId ?? 'unknown',
            name: 'My Deals',
            iconClass: 'fa-solid fa-circle-user',
          },
        ],
        staticQueryParams: { skip: null },
      });
    },
  );

export const selectShortlistOrganisationStatusButtonGroupNavigation =
  createSelector(
    selectShortlistOrganisationsTableParams,
    (params): ButtongroupNavigationModel => {
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
  selectShortlistOrganisationsTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Companies or Investors',
    }),
);

export const selectIsLoadingOrganisationsTable = createSelector(
  organisationsFeature.selectLoaded,
  (loaded) => !loaded,
);

export const isOpportunityClosed = (opportunity: OpportunityData): boolean =>
  ['pass', 'won', 'lost'].some(
    (status) => status === opportunity.stage.displayName.toLowerCase(),
  );

export const selectOrganisationRows = createSelector(
  organisationsFeature.selectAll,
  opportunitiesQuery.selectOpportunitiesDictionary,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  selectRouteParam('shortlistId'),
  (organisations, groupedDictionary, stageColorDictionary, shortlistId) => {
    const removeFromShortlistAction: DropdownAction = {
      text: 'Remove from Shortlist',
      queryParamsHandling: 'merge',
      routerLink: ['./'],
      queryParams: {
        [DialogUtil.queryParams.removeFromShortlist]: shortlistId!,
      },
      skipLocationChange: true,
    };
    return organisations.map(
      (company): OrganisationRowV2 =>
        ({
          id: company.id!,
          name: company.name,
          domains: company.domains,
          status: {
            name: company.companyStatus?.split('_').join(' ') ?? '',
            color:
              organisationStatusColorDictionary[
                company.companyStatus as CompanyStatus
              ] ?? '',
          },
          data: company.data,
          actionData: [removeFromShortlistAction],
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
                updatedAt: opportunity!.updatedAt?.toString() ?? '',
                actionData: isOpportunityClosed(opportunity!)
                  ? [
                      {
                        text: 'Reopen Opportunity',
                        queryParamsHandling: 'merge',
                        routerLink: ['./'],
                        queryParams: {
                          [DialogUtil.queryParams.reopenOpportunity]:
                            opportunity!.id,
                        },
                        skipLocationChange: true,
                      },
                    ]
                  : [
                      {
                        text: 'Update Opportunity Status',
                        queryParamsHandling: 'merge',
                        routerLink: ['./'],
                        queryParams: {
                          [DialogUtil.queryParams.updateOpportunityStage]:
                            opportunity!.id,
                        },
                        skipLocationChange: true,
                      },
                    ],
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
  selectShortlistOrganisationsTableParams,
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

export const selectCurrentShortlist = createSelector(
  selectRouteParam('shortlistId'),
  shortlistsQuery.selectEntities,
  (shortlistId, entities) => {
    const shortlist = entities[shortlistId!] ?? null;
    return {
      shortlistId,
      shortlist,
      shortlistContributors:
        shortlist?.contibutors?.map((x) => x.name).join(', ') ?? '',
      editQueryParam: {
        [DialogUtil.queryParams.updateShortlist]: shortlistId,
      },
    };
  },
);

export const selectShowCheckboxHeader = createSelector(
  selectShortlistOrganisationsTableParams,
  ({ query, member, status, filters }) => {
    return !!(query || member || status || filters);
  },
);

export const selectShortlistOrganisationsQuickFilters = createSelector(
  selectShortlistOrganisationsTableButtonGroupNavigation,
  selectOrganisationTableQueryModel,
  selectShortlistOrganisationStatusButtonGroupNavigation,
  (buttonGroupNavigation, queryModel, statuses) => {
    return {
      buttonGroupNavigation,
      queryModel,
      statuses,
    };
  },
);

export const selectShortlistOrganisationsTableViewModel = createSelector(
  selectShortlistOrganisationsQuickFilters,
  selectShortlistOrganisationsTableParams,
  selectTableModel,
  organisationsFeature.selectDataWarehouseLastUpdated,
  selectFilterIndicators,
  selectCurrentShortlist,
  selectShowCheckboxHeader,
  (
    quickFilters,
    params,
    tableModel,
    dataWarehouseLastUpdated,
    filters,
    shortlist,
    showCheckboxHeader,
  ) => {
    return {
      tableModel,
      params,
      lastUpdated: dataWarehouseLastUpdated?.lastUpdated,
      lastChecked: dataWarehouseLastUpdated?.lastChecked,
      filters,
      bulkActions: [
        {
          text: 'Remove from Shortlist',
          queryParamName: DialogUtil.queryParams.removeFromShortlist,
        },
      ] satisfies OrganisationTableBulkAction[],
      showCheckboxHeader,
      ...shortlist,
      ...quickFilters,
    };
  },
);
