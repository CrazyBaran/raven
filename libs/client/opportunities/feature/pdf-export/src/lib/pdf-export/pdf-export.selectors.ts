import {
  opportunitiesQuery,
  selectFinancialGroups,
} from '@app/client/opportunities/data-access';
import { routerQuery } from '@app/client/shared/util-router';

import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { storageQuery } from '../../../../../../shared/storage/data-access/src';
import { Heat, NoteHeatmap } from '../../../../../ui/src';

export const selectPDFExportModel = createSelector(
  routerQuery.selectCurrentOpportunityId,
  opportunitiesQuery.selectRouteOpportunityDetails,
  opportunitiesQuery.selectOpportunityNoteTabs,
  selectFinancialGroups,
  storageQuery.selectAzureImageDictionary,
  (
    opportunityId,
    opportunityDetails,
    noteTabs,
    financialGroups,
    dictionary,
  ) => {
    return {
      opportunityId,
      organisation: {
        ...opportunityDetails?.organisation,
        domain: opportunityDetails?.organisation?.domains?.[0],
      },
      opportunity: {
        ...opportunityDetails,
        currentOrganisation: null,
      },
      noteTabs: noteTabs
        .map((tab) => {
          let i = 0,
            emptyFields = 0;
          const mappedNoteFieldsGroups = tab.noteFieldGroups.map((fields) => {
            const mappedNoteFields = fields.noteFields
              .filter((noteField) => noteField.type !== 'heatmap')
              .map((field) => {
                let clearedValue = Object.entries(
                  _.chain(dictionary ?? {})
                    .mapKeys((x) => x!.fileName)
                    .mapValues((x) => x!.url)
                    .value(),
                ).reduce(
                  (acc, [fileName, sasUrl]) => {
                    return acc
                      .replace(new RegExp('&amp;', 'g'), '&')
                      .replace(fileName, sasUrl);
                  },
                  String(field.value) ?? '',
                );
                if (!clearedValue || clearedValue === 'null') {
                  emptyFields++;
                  clearedValue = '';
                }
                i++;
                return {
                  ...field,
                  value: clearedValue,
                };
              })
              .filter((value) => {
                const shouldDisplay =
                  !!value?.value &&
                  value?.value != null &&
                  (opportunityDetails?.pipelineStageId
                    ? !value?.hideOnPipelineStages?.includes?.({
                        id: opportunityDetails.pipelineStageId,
                      })
                    : true);
                return shouldDisplay;
              });
            const heatmapFields = financialGroups.filter(
              (x) =>
                x.tabName === tab.name &&
                x.noteFields.some((f) => {
                  return f.value !== null && f.value !== '';
                }),
            );
            return {
              ...fields,
              noteFields: mappedNoteFields,
              heatmapFields,
              heatMap: {
                fields: heatmapFields.map((g) => ({
                  uniqId: g.uniqId,
                  title: g.title,
                  noteFields: g.noteFields.map((f) => ({
                    uniqId: f.uniqId,
                    title: f.title,
                    value: f.value,
                    heat: f.heat as Heat,
                    unit: f.unit,
                  })),
                })),
              } as NoteHeatmap,
            };
          });
          const noteFieldGroups = mappedNoteFieldsGroups.filter(
            (x) => x.noteFields?.length,
          );
          return {
            ...tab,
            noteFieldGroups: noteFieldGroups,
            isEmpty: i === emptyFields || !noteFieldGroups.length,
          };
        })
        .filter((y) => !y.isEmpty),
    };
  },
);
