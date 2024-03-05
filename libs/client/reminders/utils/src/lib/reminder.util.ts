import { ReminderEntity } from '@app/client/reminders/state';
import {
  DropdownAction,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { TagTypeEnum } from '@app/rvns-tags';

export class ReminderUtils {
  public static getReminderActions(
    reminder: ReminderEntity,
  ): DropdownbuttonNavigationModel {
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
    reminder: ReminderEntity,
  ): { name: string; id: string } | undefined {
    return reminder.tag?.tags.find((tag) => tag.type === TagTypeEnum.Company);
  }

  public static getReminderOpportunityTag(
    reminder: ReminderEntity,
  ): { name: string; id: string } | undefined {
    return reminder.tag?.tags.find(
      (tag) => tag.type === TagTypeEnum.Opportunity,
    );
  }
}
