import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterService } from '@progress/kendo-angular-grid';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';

@Component({
  standalone: true,
  selector: 'app-number-range-filter',
  templateUrl: './number-range-filter.component.html',
  styleUrls: ['./number-range-filter.component.scss'],
  imports: [FormsModule, NumericTextBoxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberRangeFilterComponent implements OnInit {
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  public start: number | null;
  public end: number | null;

  public formatOptions: NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  };

  public get min(): number | null {
    return this.start ? this.start : null;
  }

  public get max(): number | null {
    return this.end ? this.end : null;
  }

  public ngOnInit(): void {
    const [start, end] = (this.filter.filters as FilterDescriptor[]).filter(
      (x) => (x as FilterDescriptor).field === this.field,
    );

    this.start =
      start?.value && start.value !== 'any' ? Number(start.value) : null;
    this.end = end?.value ? Number(end.value) : null;
  }

  public onStartChange(value: number): void {
    this.filterRange(value, this.end);
  }

  public onEndChange(value: number): void {
    this.filterRange(this.start, value);
  }

  private filterRange(start: number | null, end: number | null): void {
    const filters = [];

    if (start || end) {
      filters.push({
        field: this.field,
        operator: 'gte',
        value: start ?? 'any',
      });
      this.start = start;
    }

    if (end) {
      filters.push({
        field: this.field,
        operator: 'lte',
        value: end,
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: 'and',
      filters: filters,
    });
  }
}
