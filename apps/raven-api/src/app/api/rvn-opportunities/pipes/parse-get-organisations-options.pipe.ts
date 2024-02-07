import {
  CompanyFilterOptions,
  LastFundingType,
} from '@app/shared/data-warehouse';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import deparam from 'jquery-deparam';
import {
  Direction,
  GetOrganisationsOptions,
  PrimaryDataSource,
  SortableField,
  defaultGetOrganisationsOptions,
  sortableFields,
} from '../interfaces/get-organisations.options';

export class ParseGetOrganisationsOptionsPipe
  implements
    PipeTransform<Record<string, string>, Promise<GetOrganisationsOptions>>
{
  public async transform(
    values: Record<string, string>,
    _metadata: ArgumentMetadata,
  ): Promise<GetOrganisationsOptions> {
    if (!values) {
      return defaultGetOrganisationsOptions;
    }
    const options = new GetOrganisationsOptions();

    options.skip =
      values['skip'] !== undefined
        ? +values['skip']
        : defaultGetOrganisationsOptions.skip;
    options.take =
      values['take'] !== undefined
        ? +values['take']
        : defaultGetOrganisationsOptions.take;

    options.direction = (
      this.validateDirection(values['dir']) ??
      defaultGetOrganisationsOptions.direction
    )
      .toString()
      .toUpperCase() as Direction;

    options.orderBy =
      this.validateSortField(values['field']) ??
      defaultGetOrganisationsOptions.orderBy;

    options.query = values['query'] ?? null;
    options.member = values['member'] ?? null;
    options.round = values['round'] ?? null;

    options.filters = this.getFilters(values);

    options.primaryDataSource = this.evaluatePrimaryDataSource(options);
    return options;
  }

  private validateSortField(value: string): SortableField {
    if (!value) {
      return null;
    }
    return sortableFields.find((field) => field === value);
  }

  private evaluatePrimaryDataSource(
    options: GetOrganisationsOptions,
  ): PrimaryDataSource {
    if (
      [
        'funding.totalFundingAmount',
        'funding.lastFundingAmount',
        'funding.lastFundingDate',
        'funding.lastFundingType',
      ].includes(options.orderBy)
    ) {
      return 'dwh';
    }
    if (options.member !== undefined || options.round !== undefined) {
      return 'raven';
    }
    if (options.query !== undefined) {
      return 'dwh';
    }
    return 'raven';
  }

  private getFilters(values: Record<string, string>): CompanyFilterOptions {
    if (!values) {
      return null;
    }
    if (values['filters'] === undefined || values['filters'] === '') {
      return null;
    }

    const filters = new CompanyFilterOptions();

    const filterValues = deparam(values.filters);

    filters.totalFundingAmount = this.handleMinMaxNumber(
      filterValues['funding.totalFundingAmount'],
    );
    filters.lastFundingAmount = this.handleMinMaxNumber(
      filterValues['funding.lastFundingAmount'],
    );
    filters.lastFundingDate = this.handleMinMaxDate(
      filterValues['funding.lastFundingDate'],
    );
    filters.lastFundingType = filterValues[
      'funding.lastFundingType'
    ] as LastFundingType;

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

  private handleMinMaxDate(filterValue: string[]): {
    min?: Date;
    max?: Date;
  } {
    const result = { min: undefined, max: undefined };
    if (filterValue) {
      if (filterValue[0] !== 'any') {
        result.min = new Date(filterValue[0]);
      }
      if (filterValue[1] !== 'any') {
        result.max = new Date(filterValue[1]);
      }
    }

    return result;
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
