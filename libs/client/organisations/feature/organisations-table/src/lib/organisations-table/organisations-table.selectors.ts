import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import {
  ButtongroupNavigationModel,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import { selectQueryParams } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const organisationsQueryParams = [
  'query',
  'assignedTo',
  'round',
  'industry',
  'geography',
] as const;

export type OrganisationQueryParam = (typeof organisationsQueryParams)[number];

export const selectOrganisationsTableParams = createSelector(
  selectQueryParams,
  (params): Record<Partial<OrganisationQueryParam>, string> =>
    _.chain(organisationsQueryParams)
      .keyBy((x) => x)
      .mapValues((key) => params[key])
      .pickBy(Boolean)
      .value() as Record<Partial<OrganisationQueryParam>, string>,
);

export const buildButtonGroupNavigation = <T>(
  paramName: T,
  buttons: { id: string | null; name: string }[],
  value: string | null,
): ButtongroupNavigationModel => ({
  paramName: paramName as string,
  filters: buttons.map(({ id, name }) => ({
    id: id,
    name: name,
    selected: id == value,
  })),
});

export const selectOrganisationsTableButtonGroupNavigation = createSelector(
  selectOrganisationsTableParams,
  (params): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation<OrganisationQueryParam>(
      'assignedTo',
      [
        {
          id: null,
          name: 'All deals',
        },
        {
          id: 'my-deals',
          name: 'My deals',
        },
      ],
      params.assignedTo,
    );
  },
);

export const selectOrganisationTableQueryModel = createSelector(
  selectOrganisationsTableParams,
  (params) => {
    const param: OrganisationQueryParam = 'query';
    return {
      queryParamName: param,
      placeholder: 'Search Companies',
      urlValue: params[param] ?? '',
    };
  },
);

export const selectOrganisationsTableNavigationDropdowns = createSelector(
  selectOrganisationsTableParams,
  (): DropdownNavigationModel[] => [
    {
      queryParamName: 'round',
      data: [],
      defaultItem: {
        name: 'Last Round',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'industry',
      data: [],
      defaultItem: {
        name: 'Industry',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'geography',
      data: [],
      defaultItem: {
        name: 'Geography',
        id: null,
      },
      value: null,
      loading: false,
    },
  ],
);

export const selectIsLoadingOrganisationsTable = createSelector(
  OrganisationsFeature.selectLoaded,
  (loaded) => !loaded,
);

export const selectOrganisationRows = createSelector(
  OrganisationsFeature.selectAll,
  opportunitiesQuery.selectOpportunitiesGroupedByOrganisation,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  (organisations, groupedDictionary, stageColorDictionary) => {
    return organisations.map((o) => ({
      ...o,
      opportunities: (groupedDictionary[o.id!] ?? []).map((opportunity) => ({
        ...opportunity,
        stageColor: stageColorDictionary[opportunity.stage?.id] ?? '#000',
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
  (
    buttonGroupNavigation,
    navigationDropdowns,
    isLoading,
    organisations,
    queryModel,
    query,
  ) => ({
    buttonGroupNavigation,
    navigationDropdowns,
    isLoading,
    organisations,
    queryModel,
    query,
  }),
);
