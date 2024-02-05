import { ScrollingModule } from '@angular/cdk/scrolling';
import { JsonPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tapResponse } from '@ngrx/component-store';
import { FilterService } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CheckBoxModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  filterBy,
} from '@progress/kendo-data-query';
import * as _ from 'lodash';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
@Component({
  selector: 'app-multicheck-filter',
  templateUrl: './multicheck-filter.component.html',
  styleUrls: ['./multicheck-filter.component.scss'],
  standalone: true,
  imports: [
    LabelModule,
    NgClass,
    CheckBoxModule,
    ReactiveFormsModule,
    TextBoxModule,
    ScrollingModule,
    JsonPipe,
    LoaderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiCheckFilterComponent implements AfterViewInit {
  @Output() public valueChange = new EventEmitter<number[]>();

  public sourceFn = input<(filter: string) => Observable<unknown[]>>();
  public sourceFn$ = toObservable(this.sourceFn);

  public searchForm = new FormControl('');
  public search$ = this.searchForm.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    startWith(''),
  );
  public search = toSignal(this.search$);

  public isLoading = signal(false);

  public data = toSignal(
    combineLatest([this.search$, this.sourceFn$]).pipe(
      tap(() => {
        this.isLoading.set(true);
      }),
      switchMap(([filter, sourceFn]) => {
        return sourceFn?.(filter ?? '') ?? of([]);
      }),
      tapResponse({
        next: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      }),
    ),
  );

  public currentFilter = input.required<CompositeFilterDescriptor>();
  public filterService = input.required<FilterService>();
  public field = input.required<string>();

  public isPrimitive = input<boolean>();
  public textField = input<string>();
  public valueField = input<string>();

  protected value: unknown[] = [];

  protected currentData = computed(() => {
    const filtered = filterBy(this.data() ?? [], {
      operator: 'contains',
      field: this.textField(),
      value: this.search(),
    });

    return _.chain([...this.value, ...filtered])
      .uniqBy(this.textField()!)
      .value();
  });

  public textAccessor = (dataItem: unknown): string =>
    this.isPrimitive()! ? dataItem : _.get(dataItem, this.textField()!);

  public valueAccessor = (dataItem: unknown): unknown =>
    this.isPrimitive() ? dataItem : _.get(dataItem, this.valueField()!);

  public ngAfterViewInit(): void {
    this.value = this.currentFilter().filters.map(
      (f: FilterDescriptor | CompositeFilterDescriptor): unknown =>
        'value' in f ? f.value : null,
    );
  }

  public isItemSelected(item: unknown): boolean {
    return this.value.some((x) => x === this.valueAccessor(item));
  }

  public onSelectionChange(item: unknown, li: HTMLLIElement): void {
    if (this.value.some((x) => x === item)) {
      this.value = this.value.filter((x) => x !== item);
    } else {
      this.value.push(item);
    }

    this.filterService().filter({
      filters: this.value.map((value) => ({
        field: this.field(),
        operator: 'contains',
        value,
      })),
      logic: 'or',
    });

    this.onFocus(li);
  }

  public onFocus(li: HTMLLIElement): void {
    const ul = li.parentNode as HTMLUListElement;
    const below =
      ul.scrollTop + ul.offsetHeight < li.offsetTop + li.offsetHeight;
    const above = li.offsetTop < ul.scrollTop;

    // Scroll to focused checkbox
    if (above) {
      ul.scrollTop = li.offsetTop;
    }

    if (below) {
      ul.scrollTop += li.offsetHeight;
    }
  }
}
