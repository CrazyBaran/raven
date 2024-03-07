/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReminderDto } from '@app/client/reminders/data-access';
import { ReminderEntity } from '@app/client/reminders/state';
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
            {
              value: (value.tag
                ? {
                    company: {
                      id: ReminderUtils.getReminderCompanyTag(value)?.id,
                      name: ReminderUtils.getReminderCompanyTag(value)?.name,
                    },
                    opportunity: {
                      id: ReminderUtils.getReminderOpportunityTag(value)?.id,
                      name: ReminderUtils.getReminderOpportunityTag(value)
                        ?.name,
                    },
                  }
                : null) as any,
              disabled: true,
            },
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

export const MOCK_REMINDER = {
  id: '',
  name: 'Reminder Title',
  tag: {
    id: '',
    tags: [
      {
        name: 'harmonic2',
        id: 'a48fc952-1fc4-ee11-85f9-6045bd0f462e',
        type: 'company',
      },
      {
        name: 'Series C',
        id: '89e7106c-e773-ee11-8925-6045bdc18eee',
        type: 'opportunity',
      },
    ],
  },
  description:
    'Description here, goes for several rows. Dolor sit amet adipiscing elit',
  assignees: [
    {
      id: 'b7d550f4-5a72-ee11-8925-6045bdc18eee',
      name: 'John Doe',
    },
    {
      id: 'b8d550f4-5a72-ee11-8925-6045bdc18eee',
      name: 'Jane Doe',
    },
  ],
  dueDate: '2024-03-07T01:00:00.000Z',
  status: 'completed',
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies ReminderEntity;
