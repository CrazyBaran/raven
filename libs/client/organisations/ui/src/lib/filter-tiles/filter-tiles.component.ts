import { KeyValue, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { FilterParam } from '../organisations-table/table-filters';

import param from 'jquery-param';
import * as _ from 'lodash';
import { organisationTableConfiguration } from '../organisations-table/organisation-table.configuration';
@Component({
  standalone: true,
  selector: 'app-filter-tiles',
  templateUrl: './filter-tiles.component.html',
  styleUrls: ['./filter-tiles.component.scss'],
  imports: [ButtonModule, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTilesComponent {
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public filters = input.required<Record<string, FilterParam>>();

  public removeFilter(key: string): void {
    const clearedFilters = _.omit(this.filters(), key);
    const filterQuery = _.isEmpty(clearedFilters)
      ? null
      : param(clearedFilters);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { filters: filterQuery },
      queryParamsHandling: 'merge',
    });
  }

  public onTileClick(key: string): void {
    const config = this.getFilterConfig(key);

    //dirty way to open the filter menu but kendo doesn't expose a public API for this
    const el = document.querySelector(
      `.k-grid-filter-menu[title="${config?.name} Filter Menu"]`,
    ) as HTMLElement;

    setTimeout(() => {
      el?.click();
    });
  }

  public getFieldText(pair: KeyValue<string, FilterParam>): string {
    const fieldConfig = this.getFilterConfig(pair.key);
    const fieldName = fieldConfig?.name;

    const type = organisationTableConfiguration.find(
      (c) => c.field === pair.key,
    )?.filter;

    if (type === 'date') {
      return `${fieldName}: ${this.getDateRangeText(pair.value)}`;
    }

    if (type === 'number') {
      return `${fieldName}: ${this.getNumberRangeText(pair.value)}`;
    }

    return `${fieldName}: ${pair.value[0]} ${
      pair.value.length > 1 ? `+${pair.value.length - 1}` : ''
    }`;
  }

  public clearFilters(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { filters: null },
      queryParamsHandling: 'merge',
    });
  }

  private getDateRangeText(value: FilterParam): string {
    const [start, end] = value as [string, string];
    return `${
      start === 'any' ? 'any' : new Date(Number(start)).toLocaleDateString()
    } - ${end ? new Date(Number(end)).toLocaleDateString() : 'any'} `;
  }

  private getNumberRangeText(value: FilterParam): string {
    const [start, end] = value as [number, number];
    return `${start}${
      typeof start === 'string' && start === 'any' ? '' : '$'
    } - ${end ?? 'any'}${end ? '$' : ''}`;
  }

  private getFilterConfig(
    key: string,
  ): (typeof organisationTableConfiguration)[number] | undefined {
    return organisationTableConfiguration.find((c) => c.field === key);
  }
}
