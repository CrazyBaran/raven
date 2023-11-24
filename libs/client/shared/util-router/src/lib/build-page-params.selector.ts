//todo: improve typing
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { selectPageParams } from './router.selectors';

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
        .value() as any),
    }),
  );
