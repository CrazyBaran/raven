/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CompanyOpportunityTreeItem,
  ReminderForm,
} from '@app/client/reminders/ui';
import {
  MAX_SHORTLIST_DESCRIPTION_LENGTH,
  MAX_SHORTLIST_NAME_LENGTH,
} from '@app/client/shortlists/ui';
import { TagsService } from '@app/client/tags/data-access';
import { map, Observable } from 'rxjs';

export const CRAETE_REMINDER_FORM = new InjectionToken<ReminderForm>(
  'Create Reminder Form Group',
);

export const providerReminderForm = {
  provide: CRAETE_REMINDER_FORM,
  useFactory: (): ReminderForm => {
    const formBuilder = inject(FormBuilder);

    return formBuilder.group({
      title: [
        '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_SHORTLIST_NAME_LENGTH),
          ],
        },
      ],
      description: [
        '',
        [Validators.maxLength(MAX_SHORTLIST_DESCRIPTION_LENGTH)],
      ],
      tag: [null as any],
      assignees: [[] as string[], [Validators.required]],
      dueDate: [null as Date | null, [Validators.required]],
    });
  },
};

export const REMINDER_COMPANY_SOURCE = new InjectionToken(
  'Reminder Company Source',
  {
    providedIn: 'root',
    factory: (): ((id: string) => Observable<CompanyOpportunityTreeItem[]>) => {
      const tagsService = inject(TagsService);
      return (text) =>
        tagsService
          .getTags({
            type: 'company',
            take: 75, // we can't fetch to many because dropdown tree doesn't support virtual scrolling
            query: text,
          })
          .pipe(
            map(({ data }): CompanyOpportunityTreeItem[] =>
              data!.map((c) => ({ company: c, id: c.id })),
            ),
          );
    },
  },
);

export const REMINDER_USERS_SOURCE = new InjectionToken(
  'Reminder Users Source',
  {
    providedIn: 'root',
    factory: (): ((
      text: string,
    ) => Observable<{ name: string; id: string }[]>) => {
      const tagsService = inject(TagsService);
      return (text) =>
        tagsService
          .getTags({
            type: 'people',
            take: 500,
            query: text,
          })
          .pipe(
            map(({ data }) =>
              data!.map((t) => ({
                name: t.name,
                id: t.userId!,
              })),
            ),
          );
    },
  },
);
