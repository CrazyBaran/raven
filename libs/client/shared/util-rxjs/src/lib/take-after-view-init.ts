import { Observable, timer } from 'rxjs';
import { first, map, take } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const takeAfterViewInit = <T>(
  fn: () => T,
  settings: { take: number } = { take: 10 },
): Observable<T> =>
  timer(0, 50).pipe(
    take(settings.take),
    map(() => fn()),
    first((returnItem) => !!returnItem),
  );
