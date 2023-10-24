import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private static documentClick$ = fromEvent(document, 'click');

  @Output() public clickOutside = new EventEmitter<void>();

  public constructor(
    private elementRef: ElementRef,
    private zone: NgZone,
    private documentClickService: DocumentClickService,
  ) {
    this.zone.runOutsideAngular(() => {
      this.documentClickService.documentClick$
        .pipe(
          takeUntilDestroyed(),
          tap((event) => {
            if (!this.elementRef.nativeElement.contains(event.target)) {
              this.zone.run(() => {
                this.clickOutside.emit();
              });
            }
          }),
        )
        .subscribe();
    });
  }
}
