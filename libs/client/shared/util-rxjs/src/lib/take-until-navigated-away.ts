//
import {
  assertInInjectionContext,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { isNavigatingAway } from '@app/client/shared/util-router';
import { MonoTypeOperatorFunction, Observable, Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

export const takeUntilNavigatedAway = <T>(settings: {
  route: string;
  injector?: Injector;
}): MonoTypeOperatorFunction<T> => {
  const navigatedAway$ = new Subject<boolean>();

  const listenForNavigatedAway = (): void => {
    const router = inject(Router);
    router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        const currentNavigation = router.getCurrentNavigation();
        if (isNavigatingAway(currentNavigation, settings.route)) {
          navigatedAway$?.next(true);
          navigatedAway$?.complete();
        }
      });
  };

  if (settings.injector) {
    runInInjectionContext(settings.injector, () => listenForNavigatedAway());
  } else {
    assertInInjectionContext(takeUntilNavigatedAway);
    listenForNavigatedAway();
  }

  return <T>(source: Observable<T>) => {
    return source.pipe(takeUntil(navigatedAway$));
  };
};
