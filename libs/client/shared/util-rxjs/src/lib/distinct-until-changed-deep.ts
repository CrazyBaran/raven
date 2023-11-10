import { isEqual, sortBy } from 'lodash';
import { distinctUntilChanged } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const distinctUntilChangedDeep = <T>(settings?: {
  ignoreOrder?: boolean;
}) =>
  distinctUntilChanged<T>((x, y) => {
    if (settings?.ignoreOrder && Array.isArray(x) && Array.isArray(y)) {
      return isEqual(sortBy(x), sortBy(y));
    }
    return isEqual(x, y);
  });
