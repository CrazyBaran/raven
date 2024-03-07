import { tagsQuery } from '@app/client/organisations/api-tags';

import { TableViewModel } from '@app/client/shared/ui-directives';
import { ButtongroupNavigationModel } from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
  buildPageParamsSelector,
} from '@app/client/shared/util-router';
import { ShortlistEntity, shortlistsQuery } from '@app/client/shortlists/state';
import { ShortListTableRow } from '@app/client/shortlists/ui';
import { createSelector } from '@ngrx/store';

export const shortlistsQueryParams = [
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

export const selectShortlistsTableParams = buildPageParamsSelector(
  shortlistsQueryParams,
  {
    skip: '0',
    take: '30',
  },
);

export const selectShortlistsTableButtonGroupNavigation = createSelector(
  selectShortlistsTableParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'member',
      buttons: [
        {
          id: null,
          name: 'All Shortlists',
        },

        {
          id: userTag?.userId ?? 'unknown',
          name: 'My Shortlists',
          iconClass: 'fa-solid fa-circle-user',
        },
      ],
      staticQueryParams: { skip: null },
    });
  },
);

export const selectOrganisationTableQueryModel = createSelector(
  selectShortlistsTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: `Search by Shortlist's Name`,
    }),
);

export const selectShortlistRows = createSelector(
  shortlistsQuery.selectTable,
  shortlistsQuery.selectEntities,
  shortlistsQuery.selectMainShortlist,
  shortlistsQuery.selectMyShortlist,
  ({ ids }, entities, mainShortlist, myShortlist) => {
    const shortlists = [
      mainShortlist,
      myShortlist,
      ...ids
        .filter((id) => id !== myShortlist?.id && id !== mainShortlist?.id)
        .map((id) => entities[id]),
    ];

    return shortlists
      .filter((x): x is ShortlistEntity => !!x)
      .map(
        (shortlist): ShortListTableRow => ({
          id: shortlist.id,
          name: shortlist.name,
          description: shortlist.description,
          companies: shortlist.stats?.organisationsCount?.toString(),
          inPipeline: shortlist.stats?.inPipelineCount?.toString(),
          type: shortlist.type,
          contributors: shortlist.contributors?.map((x) => x.name) ?? [],
          updatedAt:
            typeof shortlist.updatedAt === 'string'
              ? shortlist.updatedAt
              : shortlist.updatedAt.toISOString(),
          actionsModel: {
            iconClass: 'fa-solid fa-ellipsis-vertical',
            actions: [
              {
                text: 'Edit Shortlist',
                queryParams: {
                  [DialogUtil.queryParams.updateShortlist]: shortlist.id,
                },
                skipLocationChange: true,
                routerLink: [''],
                queryParamsHandling: 'merge',
              },
              {
                text: 'Delete Shortlist',
                queryParams: {
                  [DialogUtil.queryParams.deleteShortlist]: shortlist.id,
                },
                skipLocationChange: true,
                routerLink: [''],
                queryParamsHandling: 'merge',
                actionStyle: { color: 'var(--informational-error)' },
              },
            ],
          },
        }),
      );
  },
);

export const selectTableModel = createSelector(
  selectShortlistsTableParams,
  selectShortlistRows,
  shortlistsQuery.selectLoadingStates,
  shortlistsQuery.selectTable,
  (
    params,
    rows,
    { table: isLoading, loadMoreTable: isLoadMore },
    { total },
  ): TableViewModel<ShortListTableRow> => ({
    ...params,
    total,
    isLoading: !!isLoading || !!isLoadMore,
    data: rows,
  }),
);

export const selectShortlistsTableViewModel = createSelector(
  selectShortlistsTableButtonGroupNavigation,
  selectOrganisationTableQueryModel,

  selectTableModel,
  (buttonGroupNavigation, queryModel, tableModel) => ({
    buttonGroupNavigation,
    queryModel,

    tableModel,
  }),
);
