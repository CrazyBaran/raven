//todo: improve typing
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { selectQueryParams } from './router.selectors';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const buildPageParamsSelector = <T extends readonly string[], R>(
  params: T,
  defaultQueryParams: Partial<R>,
) =>
  createSelector(
    selectQueryParams,
    (queryParams): R => ({
      ...defaultQueryParams,
      ...(_.chain(params)
        .keyBy((x) => x)
        .mapValues((key) => queryParams?.[key])
        .pickBy(Boolean)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .value() as any),
    }),
  );
