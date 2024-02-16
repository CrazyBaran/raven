import {
  CompanyFilterOptions,
  CountryType,
  DealRoomLastFundingType,
  LastFundingType,
} from '@app/shared/data-warehouse';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import deparam from 'jquery-deparam';
import { CompanyStatus } from 'rvns-shared';
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

    if (values['status']) {
      options.filters.status = options.filters.status
        ? [...options.filters.status, this.mapStatus(values['status'])]
        : [this.mapStatus(values['status'])];
    }

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
    if (options.query) {
      return 'dwh';
    }
    if (
      [
        'funding.totalFundingAmount',
        'funding.lastFundingAmount',
        'funding.lastFundingDate',
        'funding.lastFundingType',
        'funding.lastFundingRound',
        'hq.country',
        'mcvLeadScore',
      ].includes(options.orderBy)
    ) {
      return 'dwh';
    }
    if (
      options.filters !== null &&
      ((options.filters.totalFundingAmount !== undefined &&
        (options.filters.totalFundingAmount.max !== undefined ||
          options.filters.totalFundingAmount.min !== undefined)) ||
        (options.filters.lastFundingAmount !== undefined &&
          (options.filters.lastFundingAmount.max !== undefined ||
            options.filters.lastFundingAmount.min !== undefined)) ||
        (options.filters.lastFundingDate !== undefined &&
          (options.filters.lastFundingDate.max !== undefined ||
            options.filters.lastFundingDate.min !== undefined)) ||
        options.filters.lastFundingType !== undefined ||
        options.filters.lastFundingRound !== undefined ||
        options.filters.countries !== undefined ||
        options.filters.mcvLeadScore !== undefined ||
        options.filters.industries !== undefined ||
        options.filters.investors !== undefined)
    ) {
      return 'dwh';
    }
    if (options.member || options.round || options.filters?.status) {
      return 'raven';
    }

    return 'raven';
  }

  private getFilters(values: Record<string, string>): CompanyFilterOptions {
    if (!values) {
      return {};
    }
    if (values['filters'] === undefined || values['filters'] === '') {
      return {};
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
    ] as LastFundingType[];

    filters.lastFundingRound = filterValues[
      'funding.lastFundingRound'
    ] as DealRoomLastFundingType[];

    filters.industries = filterValues['industry'] as string[];
    filters.industries = filterValues['investor'] as string[];

    filters.countries = filterValues['hq.country'] as CountryType[];

    filters.mcvLeadScore = this.handleMinMaxNumber(
      filterValues['mcvLeadScore'],
    );

    filters.status = ((filterValues['status'] as string[]) ?? []).map(
      (status) => {
        return this.mapStatus(status);
      },
    );

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
        result.min = new Date(parseInt(filterValue[0]));
      }
      if (filterValue[1] !== 'any') {
        result.max = new Date(parseInt(filterValue[1]));
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

  private mapStatus(status: string): CompanyStatus {
    switch (status.toLowerCase()) {
      case 'met':
        return CompanyStatus.MET;
      case 'outreach':
        return CompanyStatus.OUTREACH;
      case 'live-opportunity':
      case 'live opportunity':
        return CompanyStatus.LIVE_OPPORTUNITY;
      case 'pass':
      case 'passed':
        return CompanyStatus.PASSED;
      case 'portfolio':
        return CompanyStatus.PORTFOLIO;
      case 'empty':
      default:
        return null;
    }
  }

  private getTimestamp(date: string): number {
    const parts = date.split('/');
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
}
