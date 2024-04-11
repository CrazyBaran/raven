import { PagedData } from 'rvns-shared';

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
  assignedBy: { name: string; id: string };
  tag: ReminderComplexTag;
}

export enum ReminderStatus {
  DUE = 'due',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
}

export type ReminderDto = Omit<ReminderData, 'status' | 'dueDate'> & {
  status: `${ReminderStatus}`;
  dueDate: string | Date;
};

export interface GetRemindersDto {
  query?: string;
  skip?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
  status?: string;
}

export interface ReminderStats {
  overdue: {
    forMe: number;
    forOthers: number;
  };
}
