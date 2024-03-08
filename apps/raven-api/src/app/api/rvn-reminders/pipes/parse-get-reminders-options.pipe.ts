import { ReminderStatus } from '@app/rvns-reminders';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

import {
  defaultGetRemindersOptions,
  Direction,
  GetRemindersOptions,
  SortableField,
  sortableFields,
} from '../interfaces/get-reminders.options';

export class ParseGetRemindersOptionsPipe
  implements
    PipeTransform<Record<string, string>, Promise<GetRemindersOptions>>
{
  public async transform(
    values: Record<string, string>,
    _metadata: ArgumentMetadata,
  ): Promise<GetRemindersOptions> {
    if (!values) {
      return defaultGetRemindersOptions;
    }
    const options = new GetRemindersOptions();

    options.skip =
      values['skip'] !== undefined
        ? +values['skip']
        : defaultGetRemindersOptions.skip;
    options.take =
      values['take'] !== undefined
        ? +values['take']
        : defaultGetRemindersOptions.take;

    options.direction = (
      this.validateDirection(values['dir']) ??
      defaultGetRemindersOptions.direction
    )
      .toString()
      .toUpperCase() as Direction;

    options.orderBy =
      this.validateSortField(values['field']) ??
      defaultGetRemindersOptions.orderBy;

    options.status = values['status'] as ReminderStatus;

    options.assignee = values['assignee'] ?? undefined;
    options.query = values['query'] ?? null;

    options.organisationId = values['organisationId'] ?? null;

    options.opportunityId = values['opportunityId'] ?? null;

    return options;
  }

  private validateSortField(value: string): SortableField {
    if (!value) {
      return null;
    }
    return sortableFields.find((field) => field === value);
  }

  private validateDirection(value: string): Direction {
    if (!value) {
      return 'ASC';
    }
    if (value.toUpperCase() === 'ASC' || value.toUpperCase() === 'DESC') {
      return value.toUpperCase() as Direction;
    }
    return null;
  }
}
