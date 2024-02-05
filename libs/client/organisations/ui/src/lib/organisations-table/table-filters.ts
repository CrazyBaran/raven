/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterDescriptor } from '@progress/kendo-data-query/dist/npm/filtering/filter-descriptor.interface';
import * as _ from 'lodash';

export type FilterParam =
  | string[]
  | [number | 'any', number | 'any']
  | [Date | 'any', Date | 'any'];

export const parseToFilterObject = (
  filter: CompositeFilterDescriptor,
): Record<string, FilterParam> => {
  return _.chain(filter.filters as CompositeFilterDescriptor[])
    .map((x) => {
      return {
        field: (x.filters[0] as FilterDescriptor).field,
        values: (x.filters as FilterDescriptor[]).map(({ value }) => {
          return value;
        }),
        logic: x.logic,
      };
    })
    .mapKeys((x) => x.field)
    .mapValues((x) => x.values)
    .value();
};

export const parseToFilters = (
  filterObject: Record<string, FilterParam>,
): CompositeFilterDescriptor => {
  const filters = _.chain(filterObject)
    .map((values, field) => {
      return values.map((value) => {
        return {
          field,
          operator: 'contains',
          value,
        };
      });
    })
    .map((fieldFilters) => ({
      filters: fieldFilters,
      logic: 'and',
    }))
    .value();

  return {
    filters: filters as any,
    logic: 'and',
  };
};
