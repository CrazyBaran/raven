import { Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentClickService {
  public documentClick$ = new Subject<Event>();

  public constructor(private ngZone: NgZone) {
    fromEvent(document, 'click')
      .pipe(
        takeUntilDestroyed(),
        tap((event) => this.documentClick$.next(event)),
      )
      .subscribe();
  }
}
