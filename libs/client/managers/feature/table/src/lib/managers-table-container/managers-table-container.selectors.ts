import { selectUserId } from '@app/client/core/auth';
import { RelationshipStrengthData } from '@app/client/managers/data-access';
import { managersQuery } from '@app/client/managers/state';
import { TableViewModel } from '@app/client/shared/ui-directives';
import {
  ButtongroupNavigationModel,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
  buildInputNavigation,
} from '@app/client/shared/util-router';
import { tagsFeature } from '@app/client/tags/state';
import { FundManagerData } from '@app/rvns-fund-managers';
import { createSelector } from '@ngrx/store';

export const selectManagersTableButtonGroupNavigation = createSelector(
  managersQuery.managersTableParamsOrigin,
  selectUserId,
  (params, userId): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'keyRelationship',
      buttons: [
        {
          id: null,
          name: 'All Managers',
        },
        {
          id: userId,
          name: 'My Managers',
        },
      ],
    });
  },
);

export const selectManagersTableNavigationDropdowns = createSelector(
  managersQuery.managersTableParamsOrigin,
  tagsFeature.selectPeopleTags,
  tagsFeature.selectLoadingTags,
  (params, peopleTags, loadingTags): Array<DropdownNavigationModel> => {
    const peopleData = peopleTags.map((t) => ({
      name: t.name,
      id: t.userId,
    }));

    return [
      buildDropdownNavigation({
        params,
        name: 'relationshipStrength',
        data: RelationshipStrengthData,
        defaultItem: {
          id: null,
          name: 'Relationship Strength',
        },
        loading: false,
      }),
      buildDropdownNavigation({
        params,
        name: 'keyRelationship',
        data: peopleData,
        defaultItem: {
          id: null,
          name: 'Key Relationship',
        },
        loading: loadingTags.people,
      }),
    ];
  },
);

export const selectManagersTableQueryModel = createSelector(
  managersQuery.selectManagersTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: `Search managers`,
    }),
);

export const selectManagersRows = createSelector(
  managersQuery.selectTable,
  managersQuery.selectEntities,
  ({ ids }, entities) => {
    const managers = ids.map((id) => entities[id]);
    return managers.filter((x): x is FundManagerData => !!x);
  },
);

export const selectTableModel = createSelector(
  managersQuery.selectManagersTableParams,
  selectManagersRows,
  managersQuery.selectLoadingStates,
  managersQuery.selectTable,
  (
    params,
    rows,
    { table: isLoading, loadMoreTable: isLoadMore, reloadTable },
    { total },
  ): TableViewModel<FundManagerData> => ({
    ...params,
    total,
    isLoading: !!isLoading || !!isLoadMore || !!reloadTable,
    data: rows,
  }),
);

export const selectManagersTableViewModel = createSelector(
  selectManagersTableButtonGroupNavigation,
  selectManagersTableNavigationDropdowns,
  selectManagersTableQueryModel,
  selectTableModel,
  (buttonGroup, dropdows, queryModel, tableModel) => ({
    buttonGroup,
    dropdows,
    queryModel,
    tableModel,
  }),
);
