import { ReminderStatus } from '@app/rvns-reminders';

export type Direction = 'ASC' | 'DESC';

export const sortableFields = ['name', 'dueDate'] as const;
export type SortableField = (typeof sortableFields)[number];

export class GetRemindersOptions {
  public skip?: number;
  public take?: number;
  public direction?: Direction;
  public orderBy?: SortableField;
  public status?: ReminderStatus;
  public assignee?: string;
  public query?: string;
  public organisationId?: string;
  public opportunityId?: string;
}

export const defaultGetRemindersOptions: GetRemindersOptions = {
  skip: 0,
  take: 25,
  direction: 'ASC',
  orderBy: 'dueDate',
};
