import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
} from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[clampedChangedListener]',
  standalone: true,
})
export class ClampedChangedDirective {
  protected elementRef = inject(ElementRef);

  protected resizedEvent = injectHostResizedEvent();

  @Output() public clampedChanged = new EventEmitter<boolean>();

  public constructor() {
    this.resizedEvent
      .pipe(
        takeUntilDestroyed(),
        debounceTime(5),
        map(() => this.isClamped()),
        distinctUntilChanged(),
      )
      .subscribe((isClamped) => this.clampedChanged.emit(isClamped));
  }

  private isClamped(): boolean {
    const element = this.elementRef.nativeElement;
    return (
      element.offsetWidth < element.scrollWidth ||
      element.offsetHeight < element.scrollHeight
    );
  }
}

export const injectHostResizedEvent = (): Observable<ResizeObserverEntry[]> => {
  const elementRef = inject(ElementRef);
  const destroyRef = inject(DestroyRef);

  const changeSubject$ = new Subject<ResizeObserverEntry[]>();

  const observer = new ResizeObserver((event) => {
    changeSubject$.next(event);
  });

  observer.observe(elementRef.nativeElement);

  destroyRef.onDestroy(() => observer.unobserve(elementRef.nativeElement));

  return changeSubject$.asObservable();
};
