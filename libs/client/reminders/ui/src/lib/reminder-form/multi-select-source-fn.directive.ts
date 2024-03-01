/* eslint-disable @typescript-eslint/no-explicit-any,@angular-eslint/directive-selector */
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  EventEmitter,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DropDownListComponent,
  DropDownTreeComponent,
  MultiSelectComponent,
} from '@progress/kendo-angular-dropdowns';
import { catchError, Observable, of, startWith, switchMap, tap } from 'rxjs';

@Directive({
  selector:
    'kendo-multiselect[uiMultiSelectSourceFn], kendo-dropdownlist[uiMultiSelectSourceFn], kendo-dropdowntree[uiMultiSelectSourceFn]',
  standalone: true,
})
export class MultiSelectSourceFnDirective implements OnInit {
  @Input({ alias: 'uiMultiSelectSourceFn' }) public companySourceFn: (
    id: string,
  ) => Observable<any[]>;

  public multiSelectComponent =
    inject(MultiSelectComponent, {
      optional: true,
    }) ??
    inject(DropDownTreeComponent, { optional: true }) ??
    inject(DropDownListComponent, { optional: true });

  public destroyRef = inject(DestroyRef);
  public cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    if (!this.multiSelectComponent) {
      throw new Error('MultiSelectSourceFnDirective: No component found');
    }

    this.multiSelectComponent.filterable = true;
    this.multiSelectComponent.data = [];

    const filter$ = this.multiSelectComponent.filterChange;
    (filter$ as EventEmitter<string>)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith('' as string),
        tap(() => {
          this.multiSelectComponent!.loading = true;
          this.cdr.detectChanges();
        }),
        switchMap((filter) =>
          this.companySourceFn(filter).pipe(
            tap((data) => {
              this.multiSelectComponent!.data = data;
              this.multiSelectComponent!.loading = false;
              this.cdr.detectChanges();
            }),
          ),
        ),
        catchError((error) => {
          this.multiSelectComponent!.loading = false;
          this.cdr.detectChanges();
          return of(error);
        }),
      )
      .subscribe();
  }
}
