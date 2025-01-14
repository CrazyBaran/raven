/* eslint-disable @typescript-eslint/no-explicit-any,@nx/enforce-module-boundaries */
import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReminderDto } from '@app/client/reminders/data-access';
import { ReminderForm } from '@app/client/reminders/ui';
import { ReminderUtils } from '@app/client/reminders/utils';
import {
  MAX_SHORTLIST_DESCRIPTION_LENGTH,
  MAX_SHORTLIST_NAME_LENGTH,
} from '@app/client/shortlists/ui';

export const UPDATE_REMINDER_FORM_FN = new InjectionToken(
  'Update Reminder Form Group',
  {
    providedIn: 'root',
    factory: (): ((value: ReminderDto) => ReminderForm) => {
      const formBuilder = inject(FormBuilder);

      return (value): ReminderForm => {
        return formBuilder.group({
          title: [
            value.name,
            {
              validators: [
                Validators.required,
                Validators.maxLength(MAX_SHORTLIST_NAME_LENGTH),
              ],
            },
          ],
          description: [
            value.description,
            [Validators.maxLength(MAX_SHORTLIST_DESCRIPTION_LENGTH)],
          ],
          tag: [
            (value.tag
              ? {
                  company: {
                    id: ReminderUtils.getReminderCompanyTag(value)?.id,
                    name: ReminderUtils.getReminderCompanyTag(value)?.name,
                    domain: ReminderUtils.getReminderCompanyTag(value)?.domain,
                  },
                  opportunity: ReminderUtils.getReminderOpportunityTag(value)
                    ?.id
                    ? {
                        id: ReminderUtils.getReminderOpportunityTag(value)?.id,
                        name: ReminderUtils.getReminderOpportunityTag(value)
                          ?.name,
                      }
                    : null,
                }
              : null) as any,
          ],
          assignees: [
            value.assignees.map((x) => x.id) ?? ([] as string[]),
            [Validators.required],
          ],
          dueDate: [
            value.dueDate ? new Date(value.dueDate) : null,
            [Validators.required],
          ],
        });
      };
    },
  },
);
