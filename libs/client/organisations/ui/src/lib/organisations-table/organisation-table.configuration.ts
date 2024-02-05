import { CompanyColumn } from '../dynamic-company-column/dynamic-company-column.component';
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
  // {
  //   componentPath: () =>
  //     import(
  //       '../dynamic-company-status-column/dynamic-company-status-column.component'
  //     ).then((m) => m.DynamicCompanyStatusColumnComponent),
  //   name: 'Status',
  //   field: 'status',
  //   filter: 'string',
  //   sortable: false,
  //   dataFn: (row): CompanyStatusColumn => row.status,
  // },
  // {
  //   componentPath: () =>
  //     import('../dynamic-string-column/dynamic-string-column.component').then(
  //       (m) => m.DynamicStringColumnComponent,
  //     ),
  //   name: 'MCV Score',
  //   field: 'score',
  //   type: 'number',
  //   filter: 'number',
  //   sortable: true,
  // },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'HQ Location',
    field: 'hq.location',
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
    field: 'industry.industries',
    type: 'string',
    filter: 'string',
    sortable: false,
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Total Funding (USD)',
    field: 'funding.totalFundingAmount',
    type: 'number',
    filter: 'number',
    sortable: true,
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Last Funding (USD)',
    field: 'funding.lastFundingAmount',
    type: 'number',
    filter: 'number',
    sortable: true,
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Last Funding Date',
    field: 'funding.lastFundingDate',
    type: 'date',
    filter: 'date',
    sortable: true,
  },
  {
    componentPath: () =>
      import('../dynamic-string-column/dynamic-string-column.component').then(
        (m) => m.DynamicStringColumnComponent,
      ),
    name: 'Last Funding Type',
    field: 'funding.lastFundingType',
    type: 'string',
    filter: 'string',
    sortable: true,
  },
  // {
  //   name: 'Last Funding Round',
  //   field: 'funding.lastFundingType',
  //   type: 'string',
  //   filter: 'string',
  //   sortable: true,
  // },
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
