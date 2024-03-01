export type ReminderDto = {
  id: string;
  name: string;
  description: string;
  company: {
    id: string;
    name: string;
  };
  opportunity: {
    id: string;
    name: string;
  };
  assignies: {
    id: string;
    name: string;
  }[];
  dueDate: string;
  type: 'overdue' | 'due' | 'completed';
};

export interface GetRemindersDto {
  query?: string;
  skip?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
  status?: string;
}
