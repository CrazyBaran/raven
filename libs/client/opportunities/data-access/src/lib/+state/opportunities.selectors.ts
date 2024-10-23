import { authQuery } from '@app/client/core/auth';
import { notesQuery } from '@app/client/opportunities/api-notes';
import { storageQuery } from '@app/client/shared/storage/data-access';
import { getDealLeads, getDealTeam } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import {
  HeatMapValue,
  HeatmapFieldConfigurationData,
  HeatmapFieldUtils,
} from '@app/rvns-templates';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  OpportunitiesState,
  opportunitiesAdapter,
  opportunitiesFeature,
  opportunitiesFeatureKey,
} from './opportunities.reducer';

export const { selectAll, selectEntities } =
  opportunitiesAdapter.getSelectors();

export const selectOpportunitiesState =
  createFeatureSelector<OpportunitiesState>(opportunitiesFeatureKey);

export const selectAllOpportunities = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => (state ? selectAll(state) : []),
);

export const selectIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.isLoading,
);

export const selectIsLoadingUpdateStage = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.updateStage.isLoading,
);

export const selectOpportunitiesDictionary = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => (state ? selectEntities(state) : {}),
);

export const selectOpportunitiesGroupedByOrganisation = createSelector(
  selectAllOpportunities,
  (opportunities) =>
    _.groupBy(opportunities ?? [], ({ organisation }) => organisation.id),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectOpportunityById = (id: string) =>
  createSelector(selectOpportunitiesDictionary, (dictionary) => dictionary[id]);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectOpportunityDetails = (opportunityId: string) =>
  createSelector(selectOpportunitiesDictionary, (opportunities) => {
    const opportunity = opportunities?.[opportunityId ?? ''];

    return (
      (opportunity && {
        ...opportunity,
        dealLeads: getDealLeads(opportunity?.team),
        dealTeam: getDealTeam(opportunity?.team),
        ndaTerminationDate: opportunity?.ndaTerminationDate
          ? new Date(opportunity?.ndaTerminationDate)
          : null,
      }) ??
      null
    );
  });

export const selectRouteOpportunityDetails = createSelector(
  selectOpportunitiesDictionary,
  routerQuery.selectCurrentOpportunityId,
  (opportunities, opportunityId) => {
    const opportunity = opportunities?.[opportunityId ?? ''];

    return (
      (opportunity && {
        ...opportunity,
        dealLeads: getDealLeads(opportunity?.team),
        dealTeam: getDealTeam(opportunity?.team),
        ndaTerminationDate: opportunity?.ndaTerminationDate
          ? new Date(opportunity?.ndaTerminationDate)
          : null,
      }) ??
      null
    );
  },
);

export const selectIsTeamLeadForCurrentOpportunity = createSelector(
  authQuery.selectUserEmail,
  selectRouteOpportunityDetails,
  (userEmail, opportunity) =>
    opportunity?.team?.owners?.some(
      ({ actorEmail }) => actorEmail === userEmail,
    ),
);

export const selectIsTeamMemberForCurrentOpportunity = createSelector(
  authQuery.selectUserEmail,
  selectRouteOpportunityDetails,
  (userEmail, opportunity) =>
    opportunity?.team?.owners?.some(
      ({ actorEmail }) => actorEmail === userEmail,
    ) ||
    opportunity?.team?.members?.some(
      ({ actorEmail }) => actorEmail === userEmail,
    ),
);

/**
 * Select previousStageId for opportunities in terminal stage
 */
export const selectCurrentOpportunityStageId = createSelector(
  selectRouteOpportunityDetails,
  (opportunity) => {
    const previousStageId = opportunity?.previousPipelineStageId?.toLowerCase();
    return previousStageId ?? opportunity?.stage.id ?? 'NONE';
  },
);

export const selectOpportunityNoteTabs = createSelector(
  notesQuery.selectOpportunityNotes,
  selectRouteOpportunityDetails,
  selectCurrentOpportunityStageId,
  (opportunityNotes, opportunity, stageId) =>
    opportunityNotes?.[0]?.noteTabs.filter(
      (tab) =>
        (tab.pipelineStages &&
          tab.pipelineStages
            .map((p) => String(_.get(p, 'id')))
            .includes(stageId)) ??
        [],
    ) ?? [],
);

export const selectOpportunityTemplateTabs = createSelector(
  notesQuery.selectOpportunityNotes,
  (opportunityNotes) => opportunityNotes?.[0]?.templateTabs ?? [],
);

export const selectNoteFields = createSelector(
  selectOpportunityNoteTabs,
  storageQuery.selectAzureImageDictionary,
  selectRouteOpportunityDetails,
  selectCurrentOpportunityStageId,
  (tabs, azureImageDictionary, opportunity, stageId) => {
    return _.chain(tabs)
      .map((tab) => {
        return _.chain(tab.noteFieldGroups)
          .map(({ noteFields, name, id }) => {
            return _.chain(noteFields)
              .filter(
                (noteField) =>
                  !noteField.hideOnPipelineStages ||
                  !noteField.hideOnPipelineStages.some(
                    (stage) => stage.id === stageId,
                  ),
              )
              .orderBy('order')
              .map((field) => ({
                type: 'field',
                flat: !noteFields.some((f) => f.type === 'heatmap'),
                uniqId: field.templateFieldId,
                id: field.id,
                title: field.name,
                value: Object.entries(azureImageDictionary).reduce(
                  (acc, [file, iamge]) => acc.replace(file, iamge?.url ?? ''),
                  field.value ?? '',
                ),
                tabId: tab.id,
                tabName: tab.name,
              }))
              .value();
          })
          .flatMap()
          .value();
      })
      .flatMap()
      .value();
  },
);

export const selectFinancialGroups = createSelector(
  selectOpportunityNoteTabs,
  (tabs) => {
    const fields = _.chain(tabs)
      .flatMap((x) => x.noteFieldGroups)
      .flatMap((x) => x.noteFields)
      .keyBy((x) => x.templateFieldId)
      .value();

    const fieldValues = _.chain(tabs)
      .flatMap((x) => x.noteFieldGroups)
      .flatMap((x) => x.noteFields)
      .mapKeys(({ id }) => id)
      .mapValues(({ value }) => Number(value))
      .value();

    return _.chain(tabs)
      .map((tab) => {
        return _.chain(tab.noteFieldGroups)
          .filter(({ noteFields }) =>
            noteFields.some((f) => f.type === 'heatmap'),
          )
          .map(({ noteFields, order, name, id }) => {
            return [
              {
                name: name,
                order: order,
                tabName: tab.name,
                type: 'heatmap-group',
                title: name,
                id: id,
                noteFields: noteFields.map((field) => {
                  const configuration =
                    field.configuration as HeatmapFieldConfigurationData;
                  const util = HeatmapFieldUtils.withConfig({
                    thresholds: configuration?.thresholds ?? [],
                    calculationConfig: configuration?.calculationConfig
                      ? {
                          ...configuration?.calculationConfig,
                          valueIds:
                            configuration?.calculationConfig?.valueIds?.map(
                              (id) => fields[id.toLowerCase()]?.id,
                            ),
                        }
                      : undefined,
                  });

                  const calcValue = (
                    values: Record<string, number | undefined>,
                  ): {
                    value: number | null;
                    error: string | null;
                  } => {
                    try {
                      const value = util.getCalculatedValue(values);
                      if (_.isString(value)) {
                        return { error: value, value: null };
                      }
                      return {
                        value: value,
                        error: null,
                      };
                    } catch (error) {
                      return { error: String(error), value: null };
                    }
                  };

                  const heatmapFn = (
                    value: number | string,
                  ): HeatMapValue | null =>
                    value === null || value === undefined || value === ''
                      ? null
                      : util.getColourForValue(Number(value));

                  const calculatedValueFn =
                    'calculationConfig' in field.configuration!
                      ? (
                          values: Record<string, number | undefined>,
                        ): number | null =>
                          values === null || values === undefined
                            ? null
                            : calcValue(values).value
                      : null;

                  const dynamicErrorFn =
                    'calculationConfig' in field.configuration!
                      ? (
                          values: Record<string, number | undefined>,
                        ): string | null =>
                          values === null || values === undefined
                            ? null
                            : calcValue(values).error
                      : null;

                  const value = calculatedValueFn
                    ? calculatedValueFn(fieldValues)
                    : field.value;

                  return {
                    name: field.name,
                    order: field.order,
                    type: 'heatmap',
                    uniqId: `${tab.name}-${field.name}`,
                    id: field.id,
                    title: field.name,
                    value,
                    tabId: tab.id,
                    tabName: tab.name,
                    heatmapFn,
                    calculatedValueFn,
                    dynamicErrorFn,
                    heat: heatmapFn(value!),
                    min: field.configuration!['min'],
                    max: field.configuration!['max'],
                    unit: field.configuration!['unit'],
                    templateId: field.templateFieldId,
                    ...(field.configuration ?? {}),
                  };
                }),
                tabId: tab.id,
                uniqId: `${tab.name}-${name}`,
              },
            ];
          })
          .flatMap()
          .value();
      })
      .flatMap()
      .value();
  },
);

export const selectOpportunityDetailsIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.details.isLoading,
);

export const selectOpportunityUpdateIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.update.isLoading,
);

export const opportunitiesQuery = {
  selectAllOpportunities,
  selectNoteFields,
  selectOpportunitiesDictionary,
  selectRouteOpportunityDetails,
  selectOpportunityById,
  selectOpportunitiesGroupedByOrganisation,
  selectOpportunityNoteTabs,
  selectOpportunityTemplateTabs,
  selectOpportunityDetailsIsLoading,
  selectOpportunityUpdateIsLoading,
  selectHasPermissionForCurrentOpportunity:
    selectIsTeamLeadForCurrentOpportunity,
  selectIsLoadingUpdateStage,
  selectFinancialGroups,
  selectIsTeamMemberForCurrentOpportunity,
  selectOpportunityDetails,
  ...opportunitiesFeature,
};
