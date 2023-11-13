/* eslint-disable @typescript-eslint/no-explicit-any */
import * as _ from 'lodash';
import { MonoTypeOperatorFunction, pipe } from 'rxjs';
import { scan } from 'rxjs/operators';

const counterDictionary: Record<string, number> = {};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const log = <T>(settings?: {
  message?: string;
  comparePrevious?: boolean;
}): MonoTypeOperatorFunction<T> => {
  const uniqId = _.uniqueId();
  return pipe(
    scan((prev, curr) => {
      if (!counterDictionary[uniqId]) {
        counterDictionary[uniqId] = 1;
      } else {
        counterDictionary[uniqId] += 1;
      }

      const msg = `${counterDictionary[uniqId]}. LOG${
        settings?.message ? `(${settings?.message})` : ''
      }:`;
      if (settings?.comparePrevious) {
        console.log(msg, prev, curr);
      } else {
        console.log(msg, curr);
      }

      return curr;
    }, null as any),
  );
};
