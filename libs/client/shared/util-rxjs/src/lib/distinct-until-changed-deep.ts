import { isEqual, sortBy } from 'lodash';
import { MonoTypeOperatorFunction, distinctUntilChanged } from 'rxjs';

export const distinctUntilChangedDeep = <T>(settings?: {
  ignoreOrder?: boolean;
}): MonoTypeOperatorFunction<T> =>
  distinctUntilChanged<T>((x, y) => {
    if (settings?.ignoreOrder && Array.isArray(x) && Array.isArray(y)) {
      return isEqual(sortBy(x), sortBy(y));
    }
    return isEqual(x, y);
  });
