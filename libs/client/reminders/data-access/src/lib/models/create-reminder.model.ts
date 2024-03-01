export interface CreateReminderDto {
  readonly name: string;
  readonly description?: string;
  readonly tag?: {
    companyId: string;
    opportunityId: string;
  };
  readonly dueDate: string | Date;
  readonly assignees: string[];
}
