import { ReminderDto } from './reminder.model';

export type UpdateReminderDto = Partial<
  Pick<ReminderDto, 'name' | 'description' | 'status'>
> & {
  assignees?: string[];
  dueDate?: Date;
  tag?: {
    companyId: string;
    opportunityId?: string;
  };
};
