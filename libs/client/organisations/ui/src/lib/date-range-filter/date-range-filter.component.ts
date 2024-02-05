import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DatePickerModule,
  PopupSettings,
} from '@progress/kendo-angular-dateinputs';
import {
  FilterService,
  PopupCloseEvent,
  SinglePopupService,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { addDays } from '@progress/kendo-date-math';
import { Subscription } from 'rxjs';

const closest = (
  node: HTMLElement,
  predicate: (node: HTMLElement) => boolean,
): HTMLElement => {
  while (node && !predicate(node)) {
    node = node.parentNode as HTMLElement;
  }

  return node;
};

@Component({
  standalone: true,
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  imports: [DatePickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  public start: Date | null;
  public end: Date | null;

  public popupSettings: PopupSettings = {
    popupClass: 'date-range-filter',
  };

  private popupSubscription: Subscription;

  public constructor(
    private element: ElementRef,
    private popupService: SinglePopupService,
  ) {
    // Handle the service onClose event and prevent the menu from closing when the datepickers are still active.
    this.popupSubscription = popupService.onClose.subscribe(
      (e: PopupCloseEvent) => {
        if (
          document.activeElement &&
          closest(
            document.activeElement as HTMLElement,
            (node) =>
              node === this.element.nativeElement ||
              String(node.className).indexOf('date-range-filter') >= 0,
          )
        ) {
          e.preventDefault();
        }
      },
    );
  }

  public get min(): Date | null {
    return this.start ? addDays(this.start, 1) : null;
  }

  public get max(): Date | null {
    return this.end ? addDays(this.end, -1) : null;
  }

  public ngOnInit(): void {
    const [start, end] = (this.filter.filters as FilterDescriptor[]).filter(
      (x) => (x as FilterDescriptor).field === this.field,
    );
    this.start =
      start?.value && start.value !== 'any' ? new Date(start.value) : null;
    this.end = end?.value ? new Date(end.value) : null;
  }

  public ngOnDestroy(): void {
    this.popupSubscription.unsubscribe();
  }

  public onStartChange(value: Date): void {
    this.filterRange(value, this.end);
  }

  public onEndChange(value: Date): void {
    this.filterRange(this.start, value);
  }

  private filterRange(start: Date | null, end: Date | null): void {
    const filters = [];

    if (start || end) {
      filters.push({
        field: this.field,
        operator: 'gte',
        value: start?.toLocaleDateString() ?? 'any',
      });
      this.start = start;
    }

    if (end) {
      filters.push({
        field: this.field,
        operator: 'lte',
        value: end?.toLocaleDateString(),
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: 'and',
      filters: filters,
    });
  }
}
