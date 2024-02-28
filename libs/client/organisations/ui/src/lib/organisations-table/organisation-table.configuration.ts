import { InjectionToken } from '@angular/core';
import { transformToThousands } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { CompanyColumn } from '../dynamic-company-column/dynamic-company-column.component';
import { CompanyStatusColumn } from '../dynamic-company-status-column/dynamic-company-status-column.component';
import { DateColumn } from '../dynamic-date-column/dynamic-date-column.component';
import { CompanyShortlistIndicatorColumn } from '../dynamic-shortlist-indicator-column/dynamic-shortlist-indicator-column.component';
import { TableColumn } from './organisations-table.component';

/**
 * Warehouse rows configurations
 */
export const organisationTableConfiguration: TableColumn[] = [
  {
    componentPath: () =>
      import('../dynamic-company-column/dynamic-company-column.component').then(
        (m) => m.DynamicCompanyColumnComponent,
      ),
    name: 'Company',
    field: 'company',
    filter: null,
    sortable: true,
    dataFn: (row): CompanyColumn => ({
      id: row.id,
      name: row.name,
      domains: row.domains,
    }),
  },
  {
    componentPath: () =>
      import(
        '../dynamic-shortlist-indicator-column/dynamic-shortlist-indicator-column.component'
      ).then((m) => m.DynamicShortlistIndicatorColumnComponent),
    name: 'Shortlisted',
    field: 'shortlisted',
    filter: null,
    sortable: false,
    width: 88,
    dataFn: (row): CompanyShortlistIndicatorColumn => ({
      shortlists: row.shortlists ?? [],
    }),
  },
  {
    componentPath: () =>
      import(
        '../dynamic-company-status-column/dynamic-company-status-column.component'
      ).then((m) => m.DynamicCompanyStatusColumnComponent),
    name: 'Status',
    field: 'status',
    filter: null,
    sortable: false,
    dataFn: (row): CompanyStatusColumn => {
      return {
        ...row.status,
        queryParam: {
          [DialogUtil.queryParams.moveToOutreachCompany]: row.id,
        },
      };
    },
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'MCV Score',
    field: 'mcvLeadScore',
    type: 'number',
    filter: null,
    sortable: true,
    width: 105,
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'HQ Location',
    field: 'hq.country',
    type: 'string',
    filter: 'string',
    sortable: true,
  },
  {
    componentPath: () =>
      import('../dynamic-tags-column/dynamic-tags-column.component').then(
        (m) => m.DynamicTagsColumnComponent,
      ),
    name: 'Industry',
    field: 'industry',
    type: 'string',
    filter: 'string',
    sortable: false,
    dataFn: (row): string[] => row.data?.industry.industries ?? [],
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Total Funding $',
    field: 'funding.totalFundingAmount',
    type: 'number',
    filter: 'number',
    sortable: true,
    dataFn: (row): number =>
      transformToThousands(row.data?.funding?.totalFundingAmount, 2),
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Last Funding $',
    field: 'funding.lastFundingAmount',
    type: 'number',
    filter: 'number',
    sortable: true,
    dataFn: (row): number =>
      transformToThousands(row.data?.funding?.lastFundingAmount, 2),
  },
  {
    componentPath: () =>
      import('../dynamic-date-column/dynamic-date-column.component').then(
        (m) => m.DynamicDateColumnComponent,
      ),
    name: 'Last Funding Date',
    field: 'funding.lastFundingDate',
    type: 'date',
    filter: 'date',
    sortable: true,
    dataFn: (row): DateColumn => ({
      value: row.data?.funding?.lastFundingDate,
    }),
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Last Funding Round',
    field: 'funding.lastFundingRound',
    type: 'string',
    filter: 'string',
    sortable: false,
  },
  {
    componentPath: () =>
      import('../dynamic-tags-column/dynamic-tags-column.component').then(
        (m) => m.DynamicTagsColumnComponent,
      ),
    name: 'Investors',
    field: 'actors.investors',
    type: 'string',
    filter: null,
    sortable: false,
  },
];

export const ORGANISATION_TABLE_TOKEN = new InjectionToken<TableColumn[]>(
  'Organisation Table Token',
);
