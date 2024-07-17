import { ReminderEntity } from '@app/client/reminders/state';
import {
  DropdownAction,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { TagTypeEnum } from '@app/rvns-tags';

export class ReminderUtils {
  public static getReminderActions(
    reminder: ReminderEntity | undefined,
  ): DropdownbuttonNavigationModel | undefined {
    if (!reminder) {
      return undefined;
    }
    const completeReminder = {
      text: 'Complete Reminder',
      queryParams: {
        [DialogUtil.queryParams.completeReminder]: reminder.id,
      },
      skipLocationChange: true,
      routerLink: [''],
      queryParamsHandling: 'merge',
    } satisfies DropdownAction;
    const updateReminder = {
      text: 'Update Reminder',
      queryParams: {
        [DialogUtil.queryParams.updateReminder]: reminder.id,
      },
      skipLocationChange: true,
      routerLink: [''],
      queryParamsHandling: 'merge',
    } satisfies DropdownAction;
    const deleteReminder = {
      text: 'Delete Reminder',
      queryParams: {
        [DialogUtil.queryParams.deleteReminder]: reminder.id,
      },
      skipLocationChange: true,
      routerLink: [''],
      queryParamsHandling: 'merge',
      actionStyle: { color: 'var(--informational-error)' },
    } satisfies DropdownAction;
    return {
      actions:
        reminder.status === 'completed'
          ? [updateReminder, deleteReminder]
          : [completeReminder, updateReminder, deleteReminder],
    };
  }

  public static getReminderCompanyTag(
    reminder: ReminderEntity | undefined,
  ):
    | { name: string; id: string; domain?: string; organisationId?: string }
    | undefined {
    if (!reminder) {
      return undefined;
    }
    return reminder.tag?.tags.find((tag) => tag.type === TagTypeEnum.Company);
  }

  public static getReminderOpportunityTag(
    reminder: ReminderEntity | undefined,
  ): { name: string; id: string } | undefined {
    if (!reminder) {
      return undefined;
    }
    return reminder.tag?.tags.find(
      (tag) =>
        tag.type === TagTypeEnum.Opportunity ||
        tag.type === TagTypeEnum.Version,
    );
  }

  public static getReminderCompanyOpportunityLabel(
    reminder: ReminderEntity | undefined,
  ): string {
    const company = ReminderUtils.getReminderCompanyTag(reminder);
    const opportunity = ReminderUtils.getReminderOpportunityTag(reminder);
    return `${company?.name ?? ''} ${
      opportunity?.name ? `/ ${opportunity.name}` : ``
    }`;
  }

  public static getReminderOrganisationId(
    reminder: ReminderEntity | undefined,
  ): string {
    const company = ReminderUtils.getReminderCompanyTag(reminder);
    return company?.organisationId || '';
  }

  public static canEditReminder(
    reminder: ReminderEntity | undefined,
    userId: string | undefined,
  ): boolean {
    if (!reminder || !userId) {
      return false;
    }
    return (
      reminder.assignees.some((assignee) => assignee.id === userId) ||
      reminder.assignedBy.id === userId
    );
  }
}
