/* eslint-disable @typescript-eslint/no-explicit-any,@nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Pipe,
  PipeTransform,
  signal,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridItem, GridModule, RowClassFn } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
import { RenderTemplateComponent } from '@app/client/shared/dynamic-renderer/feature';
import { DialogQueryParams } from '@app/client/shared/shelf';
import {
  ClipboardService,
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
} from '@app/client/shared/ui';
import {
  DropdownAction,
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import {
  countryTypes,
  dealRoomLastFundingTypes,
  lastFundingTypes,
} from '@app/shared/data-warehouse';
import param from 'jquery-param';
import * as _ from 'lodash';
import { CompanyStatus } from 'rvns-shared';
import { Observable, of } from 'rxjs';
import { InfinityTableViewBaseComponent } from '../../../../../shared/ui-directives/src/lib/infinity-table-view-base.directive';
import { DateRangeFilterComponent } from '../date-range-filter/date-range-filter.component';
import { MultiCheckFilterComponent } from '../multicheck-filter/multicheck-filter.component';
import { NumberRangeFilterComponent } from '../number-range-filter/number-range-filter.component';
import {
  OpportunitiesTableComponent,
  OpportunityRow,
} from '../opportunities-table/opportunities-table.component';
import { organisationTableConfiguration } from './organisation-table.configuration';
import { parseToFilterObject } from './table-filters';

export type TableColumn = {
  componentPath: () => Promise<any>;
  name: string;
  field: string;
  filter: string | null;
  sortable: boolean;
  type?: string;
  dataFn?: (row: OrganisationRowV2) => any;
};

@Pipe({
  name: 'sourceFn',
  standalone: true,
})
export class SourceFnPipe implements PipeTransform {
  protected sourceDictionary: Record<string, readonly string[]> = {
    'funding.lastFundingType': lastFundingTypes,
    'hq.country': countryTypes,
    'funding.lastFundingRound': dealRoomLastFundingTypes,
  };

  public transform(
    column: TableColumn,
  ): (filter: string) => Observable<string[]> {
    return (filter: string) =>
      of(
        (this.sourceDictionary[column.field] ?? []).filter((x) =>
          x.toLowerCase().includes(filter.toLowerCase()),
        ),
      );
  }
}

@Pipe({
  name: 'dynamicColumn',
  standalone: true,
})
export class DynamicColumnPipe implements PipeTransform {
  public transform(
    column: TableColumn,
    row: OrganisationRowV2,
  ): ComponentTemplate {
    return {
      name: column.field,
      load: column.componentPath,
      componentData: {
        field: column.dataFn
          ? column.dataFn(row)
          : _.get(row.data, column.field),
      },
    };
  }
}

export type OrganisationRowV2 = {
  id: string;
  name: string;
  domains: string[];
  status: {
    name: string;
    color: string;
  };
  opportunities: OpportunityRow[];
  data: any;
};

@Component({
  selector: 'app-organisations-table',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    TimesPipe,
    MultiCheckFilterComponent,
    DateRangeFilterComponent,
    RouterLink,
    IsEllipsisActiveDirective,
    OpportunitiesTableComponent,
    RenderTemplateComponent,
    DynamicColumnPipe,
    KendoUrlPagingDirective,
    KendoUrlSortingDirective,
    NumberRangeFilterComponent,
    SourceFnPipe,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './organisations-table.component.html',
  styleUrls: ['./organisations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrganisationsTableComponent extends InfinityTableViewBaseComponent<OrganisationRowV2> {
  @ViewChild('grid', { read: ElementRef }) public gridRef: ElementRef;

  public router = inject(Router);
  public activedRoute = inject(ActivatedRoute);
  public clipboardService = inject(ClipboardService);

  public collapsedRows = signal<string[]>([]);

  public additionalFields = organisationTableConfiguration;

  public get tableWidth(): string {
    return (
      document.getElementsByClassName('k-master-row')[0]?.clientWidth + 'px'
    );
  }

  public toggleRow(id: string): void {
    if (this.isRowCollapsed(id)) {
      this.gridRef.nativeElement
        .getElementsByClassName(`row-${id}`)[0]
        .setAttribute('row-active', false);
      this.collapsedRows.update((value) =>
        value.filter((rowId) => rowId !== id),
      );
    } else {
      this.gridRef.nativeElement
        .getElementsByClassName(`row-${id}`)[0]
        .setAttribute('row-active', true);
      this.collapsedRows.update((value) => [...value, id]);
    }
  }

  public isRowCollapsed(id: string): boolean {
    return this.collapsedRows().includes(id);
  }

  public trackByFn: TrackByFunction<GridItem> = (index, item: GridItem) =>
    'id' in item ? item.id : index;

  public override reset(): void {
    this.grid?.scrollTo({
      row: 0,
    });
    this.page = 0;
    this.collapsedRows.set([]);

    this.gridRef.nativeElement
      .querySelectorAll(`[row-active=true]`)
      .forEach((x: any) => x.setAttribute('row-active', false));
  }

  public filterChange($event: CompositeFilterDescriptor): void {
    const mapFilters = parseToFilterObject($event);
    const filters = _.isEmpty(mapFilters) ? null : param(mapFilters);

    this.router.navigate([], {
      relativeTo: this.activedRoute,
      queryParams: { filters },
      queryParamsHandling: 'merge',
    });
  }

  protected rowCallback: RowClassFn = (context) => {
    return `row-${context.dataItem.id}`;
  };

  protected getOutreachQueryParam(
    organisation: OrganisationRowV2,
  ): Record<string, string> {
    return { [DialogQueryParams.moveToOutreachCompany]: organisation.id };
  }
  protected getActionsModel(
    organisation: OrganisationRowV2,
  ): DropdownbuttonNavigationModel {
    const passAction: DropdownAction = {
      text: 'Pass on Company',
      routerLink: ['./'],
      queryParams: {
        [DialogQueryParams.passCompany]: organisation.id,
      },
      skipLocationChange: true,
      queryParamsHandling: 'merge',
    };

    const copyLinkAction: DropdownAction = {
      text: 'Copy Link to Company Details',
      click: (): void => {
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/companies', organisation.id]),
        );
        this.clipboardService.copyToClipboard(
          `${window.location.origin}${url}`,
        );
      },
    };

    return {
      actions:
        organisation.status.name !== CompanyStatus.PASSED
          ? [passAction, copyLinkAction]
          : [copyLinkAction],
    };
  }
}
