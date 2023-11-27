//todo: improve typing
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { selectPageParams } from './router.selectors';

export type DefaultQueryParams<T extends readonly string[]> = Partial<
  Record<T[number], string>
>;

export const buildPageParamsSelector = <T extends readonly string[]>(
  params: T,
  defaultQueryParams?: DefaultQueryParams<T>,
  customMapper?: (
    params: Required<DefaultQueryParams<T>>,
  ) => Required<DefaultQueryParams<T>>,
) =>
  createSelector(
    selectPageParams,
    (pageParams): Required<DefaultQueryParams<T>> => ({
      ...(defaultQueryParams ?? {}),
      ...(_.chain(params)
        .keyBy((x) => x)
        .mapValues((key) => pageParams?.[key])
        .pickBy(Boolean)
        .value() as any),
    }),
  );
