//todo: improve typing
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { selectPageParams } from './router.selectors';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const buildPageParamsSelector = <T extends readonly string[], R>(
  params: T,
  defaultQueryParams: Partial<R>,
) =>
  createSelector(
    selectPageParams,
    (pageParams): R => ({
      ...defaultQueryParams,
      ...(_.chain(params)
        .keyBy((x) => x)
        .mapValues((key) => pageParams?.[key])
        .pickBy(Boolean)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .value() as any),
    }),
  );
