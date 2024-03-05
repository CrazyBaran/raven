/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { organisationTableConfiguration } from '@app/client/organisations/ui';
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
} from '@app/client/shared/util-router';
import { OpportunityData } from '@app/rvns-opportunities';
import { createSelector } from '@ngrx/store';
import deparam from 'jquery-deparam';
import { CompanyStatus } from 'rvns-shared';

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
  'filters',
] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  organisationsQueryParams,
  {
    skip: '0',
    take: '25',
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
          name: 'My Deals',
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

export const selectIsLoadingOrganisationsTable = createSelector(
  organisationsFeature.selectLoaded,
  (loaded) => !loaded,
);

export const isOpportunityClosed = (opportunity: OpportunityData): boolean =>
  ['pass', 'won', 'lost'].some(
    (status) => status === opportunity.stage.displayName.toLowerCase(),
  );

export const selectOrganisationRows = createSelector(
  organisationsFeature.selectTableOrganisations,
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
            name: company.companyStatus?.split('_').join(' ') ?? '',
            color:
              organisationStatusColorDictionary[
                company.companyStatus as CompanyStatus
              ] ?? '',
          },
          data: company.data,
          actionData: [
            {
              text: 'Add to Shortlist',
              queryParamsHandling: 'merge',
              routerLink: ['./'],
              queryParams: {
                [DialogUtil.queryParams.addToShortlist]: company.id!,
              },
              skipLocationChange: true,
            } satisfies DropdownAction,
            {
              text: 'Add Reminder',
              queryParamsHandling: 'merge',
              routerLink: ['./'],
              queryParams: {
                [DialogUtil.queryParams.createReminder]: [company.id] as any,
              },
              skipLocationChange: true,
            } satisfies DropdownAction,
          ],
          shortlists:
            company.shortlists?.map(({ name, id }) => ({
              name: name!,
              id: id!,
            })) ?? [],
          opportunities: company.opportunities
            .map(({ id }) => groupedDictionary[id])
            .map((opportunity): OpportunityRow => {
              const reminderAction = {
                text: 'Add Reminder',
                queryParamsHandling: 'merge',
                routerLink: ['./'],
                queryParams: {
                  [DialogUtil.queryParams.createReminder]: [
                    company.id,
                    opportunity!.id,
                  ] as any,
                },
                skipLocationChange: true,
              } satisfies DropdownAction;

              return {
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
                      reminderAction,
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
                      reminderAction,
                    ],
              };
            }),
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

export const selectShowCheckboxHeader = createSelector(
  selectOrganisationsTableParams,
  ({ query, member, status, filters }) => {
    return !!(query || member || status || filters);
  },
);

export const selectOrganisationsTableViewModel = createSelector(
  selectOrganisationsTableButtonGroupNavigation,
  selectOrganisationTableQueryModel,
  selectOrganisationsTableParams,
  selectTableModel,
  organisationsFeature.selectDataWarehouseLastUpdated,
  selectFilterIndicators,
  selectOrganisationStatusButtonGroupNavigation,
  selectShowCheckboxHeader,
  (
    buttonGroupNavigation,
    queryModel,
    params,
    tableModel,
    dataWarehouseLastUpdated,
    filters,
    statuses,
    showCheckboxHeader,
  ) => {
    return {
      buttonGroupNavigation,
      queryModel,
      tableModel,
      params,
      lastUpdated: dataWarehouseLastUpdated?.lastUpdated,
      lastChecked: dataWarehouseLastUpdated?.lastChecked,
      filters,
      statuses,
      rows: organisationTableConfiguration,
      bulkActions: [
        {
          text: 'Add to Shortlist',
          queryParamName: DialogUtil.queryParams.addToShortlist,
        },
      ] satisfies OrganisationTableBulkAction[],
      showCheckboxHeader,
    };
  },
);
