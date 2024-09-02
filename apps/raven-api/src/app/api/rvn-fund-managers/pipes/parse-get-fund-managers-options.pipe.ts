import { ArgumentMetadata, ParseUUIDPipe, PipeTransform } from '@nestjs/common';

import deparam from 'jquery-deparam';
import { FundManagerRelationStrength } from 'rvns-shared';
import {
  defaultGetFundManagersOptions,
  Direction,
  GetFundManagersOptions,
  SortableField,
  sortableFields,
} from '../interfaces/get-fund-managers.options';

export class ParseGetFundManagersOptionsPipe
  implements
    PipeTransform<Record<string, string>, Promise<GetFundManagersOptions>>
{
  public async transform(
    values: Record<string, string>,
    _metadata: ArgumentMetadata,
  ): Promise<GetFundManagersOptions> {
    if (!values) {
      return defaultGetFundManagersOptions;
    }
    const options = new GetFundManagersOptions();

    options.skip =
      values['skip'] !== undefined
        ? +values['skip']
        : defaultGetFundManagersOptions.skip;
    options.take =
      values['take'] !== undefined
        ? +values['take']
        : defaultGetFundManagersOptions.take;

    options.direction = (this.validateDirection(values['dir']) ??
      defaultGetFundManagersOptions.direction)!
      .toString()
      .toUpperCase() as Direction;

    options.orderBy =
      this.validateSortField(values['field']) ??
      defaultGetFundManagersOptions.orderBy;

    options.query = values['query'] ?? null;

    options.relationshipStrength =
      (values['relationshipStrength'] as FundManagerRelationStrength) ??
      undefined;

    options.keyRelationship = values['keyRelationship'] ?? undefined;

    if (values['organisationId']) {
      const parseUUIDPipe = new ParseUUIDPipe();
      options.organisationId = await parseUUIDPipe.transform(
        values['organisationId'],
        {
          type: 'custom',
        },
      );
    }

    options.filters = this.getFilters(values);

    return options;
  }

  private validateSortField(value: string): SortableField | null | undefined {
    if (!value) {
      return null;
    }
    return sortableFields.find((field) => field === value);
  }

  private validateDirection(value: string): Direction | null {
    if (!value) {
      return 'ASC';
    }
    if (value.toUpperCase() === 'ASC' || value.toUpperCase() === 'DESC') {
      return value.toUpperCase() as Direction;
    }
    return null;
  }

  private getFilters(values: Record<string, string>): {
    avgCheckSize?: { min?: number; max?: number };
  } {
    if (!values) {
      return {};
    }
    if (values['filters'] === undefined || values['filters'] === '') {
      return {};
    }

    const filters: {
      avgCheckSize?: { min?: number; max?: number };
      industryTags?: Array<string>;
      geography?: Array<string>;
    } = {};

    const filterValues = deparam(values.filters);

    filters.avgCheckSize = this.handleMinMaxNumber(
      filterValues['avgCheckSize'],
    );

    filters.industryTags = filterValues['industryTags'] as string[];
    filters.geography = filterValues['geography'] as string[];

    return filters;
  }

  private handleMinMaxNumber(filterValue: string[]): {
    min?: number;
    max?: number;
  } {
    const result = { min: undefined, max: undefined };
    if (filterValue) {
      if (filterValue[0] !== 'any') {
        result.min = +filterValue[0];
      }
      if (filterValue[1] !== 'any') {
        result.max = +filterValue[1];
      }
    }

    return result;
  }
}
