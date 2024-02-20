import { tagsQuery } from '@app/client/organisations/api-tags';

import { DialogQueryParams } from '@app/client/shared/shelf';
import { TableViewModel } from '@app/client/shared/ui-directives';
import { ButtongroupNavigationModel } from '@app/client/shared/ui-router';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
  buildPageParamsSelector,
} from '@app/client/shared/util-router';
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
    take: '25',
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
          name: 'All Companies',
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

// export const selectIsLoadingOrganisationsTable = createSelector(
//   organisationsFeature.selectLoaded,
//   (loaded) => !loaded,
// );

export const selectShortlistRows = createSelector(
  tagsQuery.selectCurrentUserTag,
  (organisations): ShortListTableRow[] => {
    return [
      {
        id: '1',
        name: 'Shortlist 1',
        description: 'Shortlist 1 Description',
        companies: '12',
        inPipeline: '3',
        contributors: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-08-01',
        actionsModel: {
          iconClass: 'fa-solid fa-ellipsis-vertical',
          actions: [
            {
              text: 'Edit Shortlist',
              queryParams: { [DialogQueryParams.updateShortlist]: '1' },
              skipLocationChange: true,
              routerLink: [''],
              queryParamsHandling: 'merge',
            },
            {
              text: 'Delete Shortlist',
              queryParams: { [DialogQueryParams.deleteShortlist]: '1' },
              skipLocationChange: true,
              routerLink: [''],
              queryParamsHandling: 'merge',
              actionStyle: { color: 'var(--informational-error)' },
            },
          ],
        },
      },
      {
        id: '2',
        name: 'Shortlist 2',
        description: 'Shortlist 2 Description',
        companies: '5',
        inPipeline: '2',
        contributors: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-08-01',
      },
      {
        id: '3',
        name: 'Shortlist 3',
        description: 'Shortlist 3 Description',
        companies: '8',
        inPipeline: '1',
        contributors: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-08-01',
      },
    ];
  },
);

export const selectTableModel = createSelector(
  selectShortlistsTableParams,
  selectShortlistRows,
  (params, rows): TableViewModel<ShortListTableRow> => ({
    ...params,
    isLoading: false,
    total: 50,
    data: rows,
  }),
);

export const selectShortlistsTableViewModel = createSelector(
  selectShortlistsTableButtonGroupNavigation,
  selectOrganisationTableQueryModel,
  selectShortlistsTableParams,
  selectTableModel,
  (buttonGroupNavigation, queryModel, params, tableModel) => ({
    buttonGroupNavigation,
    queryModel,
    params,
    tableModel,
  }),
);
