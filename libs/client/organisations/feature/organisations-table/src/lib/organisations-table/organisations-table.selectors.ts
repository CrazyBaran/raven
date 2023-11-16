import { opportunitiesQuery } from '@app/client/organisations/api-opportunities';
import { pipelinesQuery } from '@app/client/organisations/api-pipelines';
import { tagsFeature } from '@app/client/organisations/api-tags';
import { OrganisationsFeature } from '@app/client/organisations/state';
import {
  ButtongroupNavigationModel,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import { selectQueryParams } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const organisationsQueryParams = [
  'query',
  'my',
  'opportunity',
  'lead',
  'skip',
  'take',
  'field',
  'dir',
] as const;

export type OrganisationQueryParam = (typeof organisationsQueryParams)[number];
export type OrganisationQueryParams = Partial<
  Record<OrganisationQueryParam, string>
>;

export const defaultOrganisationQuery: OrganisationQueryParams = {
  skip: '0',
  take: '15',
};

export const selectOrganisationsTableParams = createSelector(
  selectQueryParams,
  (params): Record<Partial<OrganisationQueryParam>, string> => ({
    ...defaultOrganisationQuery,
    ...(_.chain(organisationsQueryParams)
      .keyBy((x) => x)
      .mapValues((key) => params[key])
      .pickBy(Boolean)
      .value() as Record<Partial<OrganisationQueryParam>, string>),
  }),
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
      'my',
      [
        {
          id: null,
          name: 'All deals',
        },
        {
          id: 'true',
          name: 'My deals',
        },
      ],
      params.my,
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
  tagsFeature.selectOpportunityTags,
  tagsFeature.selectPeopleTags,
  tagsFeature.selectLoadingTags,
  (
    params,
    opportunityTags,
    peopleTags,
    loadingTags,
  ): (DropdownNavigationModel & {
    queryParamName: OrganisationQueryParam;
  })[] => {
    const opportunityData = opportunityTags.map((t) => ({
      name: t.name,
      id: t.id,
    }));

    const peopleData = peopleTags.map((t) => ({
      name: t.name,
      id: t.id,
    }));

    return [
      {
        queryParamName: 'opportunity',
        data: opportunityData,
        defaultItem: {
          id: null,
          name: 'Any Opportunity',
        },
        value: opportunityData.find(({ id }) => id === params.opportunity),
        loading: loadingTags.opportunity,
      },
      {
        queryParamName: 'lead',
        data: peopleData,
        defaultItem: {
          name: 'Any Deal Lead',
          id: null,
        },
        value: peopleData.find(({ id }) => id === params.lead),
        loading: loadingTags.people,
      },
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
          stageColor: stageColorDictionary[opportunity!.stage?.id] ?? '#000',
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
