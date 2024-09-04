import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FilterService } from '@progress/kendo-angular-grid';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { CurrencyData } from 'rvns-shared';

@Component({
  standalone: true,
  selector: 'app-number-range-filter',
  templateUrl: './number-range-filter.component.html',
  styleUrls: ['./number-range-filter.component.scss'],
  imports: [FormsModule, NumericTextBoxModule, DropDownsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberRangeFilterComponent implements OnInit {
  public readonly currencyData = CurrencyData;

  public filter = input<CompositeFilterDescriptor>();
  public filterService = input<FilterService>();
  public field = input<string>();

  public showCurrency = input(false);

  public start: number | null;
  public end: number | null;
  public currency: string | null;

  public get min(): number | null {
    return this.start ? this.start : null;
  }

  public get max(): number | null {
    return this.end ? this.end : null;
  }

  public ngOnInit(): void {
    const currencyFilter =
      (this.filter()?.filters as FilterDescriptor[]).filter(
        (x) =>
          (x as FilterDescriptor).field === this.field() &&
          this.currencyData.includes(x.value),
      ) || [];

    const filters =
      (this.filter()?.filters as FilterDescriptor[]).filter(
        (x) =>
          (x as FilterDescriptor).field === this.field() &&
          !this.currencyData.includes(x.value),
      ) || [];

    this.start =
      filters[0]?.value && filters[0].value !== 'any'
        ? Number(filters[0].value)
        : null;

    this.end = filters[1]?.value ? Number(filters[1].value) : null;
    this.currency = currencyFilter[0]?.value || null;
  }

  public onStartChange(value: number): void {
    this.filterRange(value, this.end, this.currency);
  }

  public onEndChange(value: number): void {
    this.filterRange(this.start, value, this.currency);
  }

  public onCurrencyChange(value: string): void {
    this.filterRange(this.start, this.end, value);
  }

  private filterRange(
    start: number | null,
    end: number | null,
    currency: string | null,
  ): void {
    const filters = [];

    if (start || end) {
      filters.push({
        field: this.field(),
        operator: 'gte',
        value: start ?? 'any',
      });
      this.start = start;
    }

    if (end) {
      filters.push({
        field: this.field(),
        operator: 'lte',
        value: end,
      });
      this.end = end;
    }

    if (currency) {
      filters.push({
        field: this.field(),
        operator: 'eq',
        value: currency,
      });
      this.currency = currency;
    }

    this.filterService()?.filter({
      logic: 'and',
      filters: filters,
    });
  }
}
