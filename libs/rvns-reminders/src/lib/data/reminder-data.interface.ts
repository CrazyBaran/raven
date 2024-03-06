import { PagedData } from 'rvns-shared';
import { ReminderStatus } from '../enums/reminder-status.enum';

export interface PagedReminderData extends PagedData<ReminderData> {}

export interface ReminderAssignee {
  id: string;
  name: string;
}

export interface ReminderComplexTag {
  id: string;
  tags: ReminderTag[];
}

export interface ReminderTag {
  id: string;
  name: string;
  type: string;
  organisationId: string;
}

export interface ReminderData {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: ReminderStatus;
  assignees: ReminderAssignee[];
  tag: ReminderComplexTag;
  assignedBy: ReminderAssignee;
}
