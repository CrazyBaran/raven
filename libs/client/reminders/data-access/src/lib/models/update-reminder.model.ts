import { ReminderDto } from './reminder.model';

export type UpdateReminderDto = Partial<
  Pick<ReminderDto, 'name' | 'company' | 'description' | 'type'>
> & {
  assignies?: string[];
  dueDate?: Date;
  tag?: {
    companyId: string;
    opportunityId: string;
  };
};
