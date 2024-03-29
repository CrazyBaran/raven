import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
  GetRemindersStatsOptions,
  defaultGetRemindersStatsOptions,
} from '../interfaces/get-reminders-stats.options';

import { GetRemindersOptions } from '../interfaces/get-reminders.options';

export class ParseGetRemindersStatsOptionsPipe
  implements
    PipeTransform<Record<string, string>, Promise<GetRemindersStatsOptions>>
{
  public async transform(
    values: Record<string, string>,
    _metadata: ArgumentMetadata,
  ): Promise<GetRemindersOptions> {
    if (!values) {
      return defaultGetRemindersStatsOptions;
    }
    const options = new GetRemindersStatsOptions();

    options.organisationId = values['organisationId'] ?? null;

    options.opportunityId = values['opportunityId'] ?? null;

    return options;
  }
}
