import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CurrencySymbol,
  GeographyData,
} from '@app/client/managers/data-access';
import { parseToFilterObject } from '@app/client/organisations/ui';
import { KendoUrlSortingDirective } from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { ThousandSuffixesPipe } from '@app/client/shared/ui-pipes';
import { FundManagerData } from '@app/rvns-fund-managers';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import param from 'jquery-param';
import * as _ from 'lodash';
import { MultiCheckFilterComponent } from '../../../../../organisations/ui/src/lib/multicheck-filter/multicheck-filter.component';
import { NumberRangeFilterComponent } from '../../../../../organisations/ui/src/lib/number-range-filter/number-range-filter.component';

import { Tag, TagsService } from '@app/client/tags/data-access';
import { Observable, map, of } from 'rxjs';
import { RelationshipStrengthComponent } from '../relationship-strength/relationship-strength.component';

@Component({
  selector: 'app-managers-table',
  standalone: true,
  imports: [
    RouterLink,
    GridModule,
    KendoUrlSortingDirective,
    ShowTooltipIfClampedDirective,
    TooltipModule,
    RelationshipStrengthComponent,
    ThousandSuffixesPipe,
    NumberRangeFilterComponent,
    MultiCheckFilterComponent,
  ],
  templateUrl: './managers-table.component.html',
  styleUrl: './managers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagersTableComponent extends InfinityTableViewBaseComponent<FundManagerData> {
  public readonly tagsService = inject(TagsService);
  public readonly currencySymbol = CurrencySymbol;

  public trackByFn = this.getTrackByFn('id');

  public filterChange($event: CompositeFilterDescriptor): void {
    const mapFilters = parseToFilterObject($event);
    const filters = _.isEmpty(mapFilters) ? null : param(mapFilters);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { filters },
      queryParamsHandling: 'merge',
    });
  }

  public geographySource = (search: string): Observable<string[]> =>
    of(
      GeographyData.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase()),
      ),
    );

  public industrySource = (search: string): Observable<Tag[]> =>
    this.tagsService
      .getTags({ type: 'industry', query: search })
      .pipe(map((response) => response.data!));
}
