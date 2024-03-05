/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { random } from 'lodash';
import { PagedData } from 'rvns-shared';
import { Observable, delay, of } from 'rxjs';
import { CreateReminderDto } from './models/create-reminder.model';
import { GetRemindersDto, ReminderDto } from './models/reminder.model';
import { UpdateReminderDto } from './models/update-reminder.model';

@Injectable({
  providedIn: 'root',
})
export class MockRemindersService {
  private reminders: ReminderDto[] = [
    {
      id: '1',
      name: 'Reminder 1',
      description: 'Description 1',
      company: { id: '1', name: 'Company 1' },
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '1', name: 'Assignee 1' }],
      dueDate: '2023-01-01',
      type: 'overdue',
    },
    {
      id: '2',
      name: 'Reminder 2',
      description: 'Description 2',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '2', name: 'Assignee 2' }],
      dueDate: '2023-02-02',
      type: 'due',
    },
    {
      id: '3',
      name: 'Reminder 3',
      description: 'Description 3',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '3', name: 'Assignee 3' }],
      dueDate: '2023-03-03',
      type: 'overdue',
    },
    {
      id: '4',
      name: 'Reminder 4',
      description: 'Description 4',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '4', name: 'Assignee 4' }],
      dueDate: '2023-04-04',
      type: 'due',
    },
    {
      id: '5',
      name: 'Reminder 5',
      description: 'Description 5',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '5', name: 'Assignee 5' }],
      dueDate: '2023-05-05',
      type: 'overdue',
    },
    {
      id: '6',
      name: 'Reminder 6',
      description: 'Description 6',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '6', name: 'Assignee 6' }],
      dueDate: '2023-06-06',
      type: 'due',
    },
    {
      id: '7',
      name: 'Reminder 7',
      description: 'Description 7',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '7', name: 'Assignee 7' }],
      dueDate: '2023-07-07',
      type: 'completed',
    },
    {
      id: '8',
      name: 'Reminder 8',
      description: 'Description 8',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '8', name: 'Assignee 8' }],
      dueDate: '2023-08-08',
      type: 'completed',
    },
    {
      id: '9',
      name: 'Reminder 9',
      description: 'Description 9',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '9', name: 'Assignee 9' }],
      dueDate: '2023-09-09',
      type: 'completed',
    },
    {
      id: '10',
      name: 'Reminder 10',
      description: 'Description 10',
      tag: {
        id: '1',
        tags: [
          { id: '1', name: 'Company 1', type: 'company' },
          { id: '2', name: 'Opportunity 1', type: 'opportunity' },
        ],
      },
      assignees: [{ id: '10', name: 'Assignee 10' }],
      dueDate: '2023-10-10',
      type: 'completed',
    },
  ]
    .reduce(
      (acc, item) => [
        ...acc,
        item,
        item,
        item,
        item,
        item,
        item,
        item,
        item,
        item,
      ],
      [] as any,
    )
    .map((item: any, index: any) => ({
      ...item,
      id: index.toString(),
      name: `Reminder ${index}`,
    })); // This will act as our "database"

  public getReminders(
    params?: GetRemindersDto,
  ): Observable<GenericResponse<PagedData<ReminderDto>>> {
    const { skip, take } = { skip: 0, take: 25, ...params };
    const items = this.reminders.filter((r) => {
      if (params?.status) {
        return params.status === 'completed' && r.status === 'completed';
      }
      return r.status !== 'completed';
    });
    return of({
      data: {
        items: items.slice(Number(skip), Number(skip) + Number(take)),
        total: items.length,
      },
    } as any).pipe(delay(750));
  }

  public getReminder(id: string): Observable<GenericResponse<ReminderDto>> {
    const reminder = this.reminders.find((reminder) => reminder.id === id);
    return of({ data: reminder } as any).pipe(delay(750));
  }

  public createReminder(
    createReminder: CreateReminderDto,
  ): Observable<GenericResponse<ReminderDto>> {
    const created = {
      id: Math.random().toString(36).substr(2, 9),
      name: createReminder.name,

      assignees: createReminder.assignees.map((x) => {
        return { name: `random new name ${random(5)}`, id: x };
      }),
      company: {
        id: createReminder.tag?.companyId,
        name: `random Company Name ${random(5)}`,
      },
      opportunity: {
        id: createReminder.tag?.opportunityId,
        name: `random Company Name ${random(5)}`,
      },
      type: 'due',
      description: createReminder.description,
      dueDate: createReminder.dueDate,
    };
    this.reminders = [created, ...this.reminders] as any;
    return of({ data: created } as any).pipe(delay(750));
  }

  public updateReminder(
    id: string,
    changes: UpdateReminderDto,
  ): Observable<GenericResponse<ReminderDto>> {
    const index = this.reminders.findIndex((reminder) => reminder.id === id);

    const updated = { ...this.reminders[index], ...changes };
    this.reminders = this.reminders.map((reminder) =>
      reminder.id === id ? updated : reminder,
    ) as any;

    return of({ data: updated } as any).pipe(delay(750));
  }

  public completeReminder(
    ids: string[],
  ): Observable<GenericResponse<ReminderDto>> {
    ids.forEach((id) => this._updateReminder(id, { status: 'completed' }));
    return of({ data: null } as any).pipe(delay(750));
  }

  public deleteReminder(
    shortlistId: string,
  ): Observable<GenericResponse<null>> {
    this.reminders = this.reminders.filter(
      (reminder) => reminder.id !== shortlistId,
    );
    return of({ data: null } as any).pipe(delay(750));
  }

  private _updateReminder(id: string, changes: UpdateReminderDto) {
    const index = this.reminders.findIndex((reminder) => reminder.id === id);
    const updated = { ...this.reminders[index], ...changes };
    this.reminders = this.reminders.map((reminder) =>
      reminder.id === id ? updated : reminder,
    ) as any;
  }
}
