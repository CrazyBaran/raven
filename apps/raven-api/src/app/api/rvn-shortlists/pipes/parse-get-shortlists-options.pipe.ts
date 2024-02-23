import { ArgumentMetadata, ParseUUIDPipe, PipeTransform } from '@nestjs/common';

import {
  defaultGetShortlistsOptions,
  Direction,
  GetShortlistsOptions,
  SortableField,
  sortableFields,
} from '../interfaces/get-shortlists.options';

export class ParseGetShortlistsOptionsPipe
  implements
    PipeTransform<Record<string, string>, Promise<GetShortlistsOptions>>
{
  public async transform(
    values: Record<string, string>,
    _metadata: ArgumentMetadata,
  ): Promise<GetShortlistsOptions> {
    if (!values) {
      return defaultGetShortlistsOptions;
    }
    const options = new GetShortlistsOptions();

    options.skip =
      values['skip'] !== undefined
        ? +values['skip']
        : defaultGetShortlistsOptions.skip;
    options.take =
      values['take'] !== undefined
        ? +values['take']
        : defaultGetShortlistsOptions.take;

    options.direction = (
      this.validateDirection(values['dir']) ??
      defaultGetShortlistsOptions.direction
    )
      .toString()
      .toUpperCase() as Direction;

    options.orderBy =
      this.validateSortField(values['field']) ??
      defaultGetShortlistsOptions.orderBy;

    options.query = values['query'] ?? null;

    if (values['organisationId']) {
      const parseUUIDPipe = new ParseUUIDPipe();
      options.organisationId = await parseUUIDPipe.transform(
        values['organisationId'],
        {
          type: 'custom',
        },
      );
    }

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
