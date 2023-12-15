import { FormControl, FormRecord } from '@angular/forms';
import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  DynamicControl,
  DynamicGroupControl,
} from '@app/client/shared/dynamic-form-util';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { distinctUntilChanged, map } from 'rxjs';

export const flatNestedRecord = (
  value: Record<string, Record<string, number | undefined> | undefined>,
) => {
  return _.chain(value)
    .map((value, id) =>
      _.chain(value)
        .map((value, key) => ({
          id: key,
          value,
        }))
        .value(),
    )
    .flatMap()
    .mapKeys(({ id }) => id)
    .mapValues(({ value }) => value)
    .value();
};

export const selectFinancialNoteFields = createSelector(
  routerQuery.selectActiveTab,
  opportunitiesQuery.selectFinancialGroups,
  (tab, notes) => notes.filter((x) => x.tabName === tab),
);

export const selectEditFinancialDynamicControls =
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (form: FormRecord<FormRecord<FormControl<number>>>) =>
    createSelector(selectFinancialNoteFields, (financialNoteGroupFields) => {
      return _.chain(financialNoteGroupFields)
        .map(
          (group): DynamicGroupControl => ({
            ...group,
            type: 'group',
            controls: _.chain(group.noteFields)
              .map((control, i): DynamicControl => {
                const flatValues$ = form.valueChanges.pipe(
                  map((v) => {
                    const value = v;
                    return _.chain(flatNestedRecord(value))
                      .mapValues((v, key) =>
                        v === null || v === undefined ? undefined : Number(v),
                      )
                      .value();
                  }),
                );

                return {
                  ...control,
                  type: 'numeric',
                  value: control.value ? Number(control.value) : null,
                  readonly: !!control.calculatedValueFn,
                  autoCorrect: !control.calculatedValueFn,
                  dynamicError$: control.dynamicErrorFn
                    ? flatValues$.pipe(
                        map((v) => control.dynamicErrorFn!(v)),
                        distinctUntilChanged(),
                      )
                    : undefined,
                  calculatedValue$: control.calculatedValueFn
                    ? flatValues$.pipe(
                        map((v) => control.calculatedValueFn!(v)),
                        distinctUntilChanged(),
                      )
                    : undefined,
                  validators: {
                    min: control.min,
                    max: control.max,
                  },
                };
              })
              .mapKeys(({ id }) => id)
              .value(),
          }),
        )
        .mapKeys(({ id }) => id)
        .value();
    });

export const selectCreateOpportunityDialogViewModel = createSelector(
  notesQuery.selectNoteUpdateIsLoading,
  notesQuery.selectOpportunityNotes,
  routerQuery.selectCurrentOpportunityId,
  (isLoading, opportunityNotes, opportunityId) => ({
    isUpdating: isLoading,
    opportunityNote: opportunityNotes?.[0],
    opportunityId,
  }),
);
