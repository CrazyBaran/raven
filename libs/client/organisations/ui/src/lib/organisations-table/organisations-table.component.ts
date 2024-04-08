/* eslint-disable @typescript-eslint/no-explicit-any,@nx/enforce-module-boundaries */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RenderTemplateComponent } from '@app/client/shared/dynamic-renderer/feature';
import {
  ClipboardService,
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
  LoaderComponent,
} from '@app/client/shared/ui';
import {
  FeatureFlagDirective,
  InfinityTableViewBaseComponent,
  IsEllipsisActiveDirective,
  OnResizeDirective,
  ResizedEvent,
} from '@app/client/shared/ui-directives';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownAction,
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridItem, GridModule, RowClassFn } from '@progress/kendo-angular-grid';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { RxIf } from '@rx-angular/template/if';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import param from 'jquery-param';
import * as _ from 'lodash';
import { CompanyStatus } from 'rvns-shared';
import { DateRangeFilterComponent } from '../date-range-filter/date-range-filter.component';
import { MultiCheckFilterComponent } from '../multicheck-filter/multicheck-filter.component';
import { NumberRangeFilterComponent } from '../number-range-filter/number-range-filter.component';
import { OpportunitiesTableComponent } from '../opportunities-table/opportunities-table.component';
import { DynamicColumnPipe } from './dynamic-column.pipe';
import {
  OrganisationRowV2,
  OrganisationTableBulkAction,
  TableColumn,
} from './models';
import { SourceFnPipe } from './source-fn.pipe';
import { parseToFilterObject } from './table-filters';

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
    OnResizeDirective,
    CheckBoxModule,
    RxUnpatch,
    RxIf,
    FeatureFlagDirective,
    LoaderComponent,
  ],
  templateUrl: './organisations-table.component.html',
  styleUrls: ['./organisations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrganisationsTableComponent extends InfinityTableViewBaseComponent<OrganisationRowV2> {
  @ViewChild('grid', { read: ElementRef }) public gridRef: ElementRef;

  public emptyMessageTemplate = input<TemplateRef<any>>();

  public bulkActions = input<OrganisationTableBulkAction[]>([]);

  public showCheckboxHeader = input<boolean>(false);

  public clipboardService = inject(ClipboardService);

  public cdr = inject(ChangeDetectorRef);

  public rows = input.required<TableColumn[]>();

  public emptyMessage = input<string>();

  public collapsedRows = signal<string[]>([]);

  public checkedRows = signal<string[]>([]);

  public checkedAll = signal<boolean>(false);

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
    this.checkedRows.set([]);
    this.checkedAll.set(false);
  }

  public filterChange($event: CompositeFilterDescriptor): void {
    const mapFilters = parseToFilterObject($event);
    const filters = _.isEmpty(mapFilters) ? null : param(mapFilters);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { filters },
      queryParamsHandling: 'merge',
    });
  }

  public onResize($event: ResizedEvent): void {
    this.cdr.detectChanges();
  }

  protected rowCallback: RowClassFn = (context) => {
    return `row-${context.dataItem.id}`;
  };

  protected getActionsModel(
    organisation: OrganisationRowV2,
  ): DropdownbuttonNavigationModel {
    const passAction: DropdownAction = {
      text: 'Pass on Company',
      routerLink: ['./'],
      queryParams: {
        [DialogUtil.queryParams.passCompany]: organisation.id,
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
          ? [passAction, copyLinkAction, ...(organisation.actionData ?? [])]
          : [copyLinkAction, ...(organisation.actionData ?? [])],
    };
  }

  protected toggleAll($event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;
    this.checkedAll.set(checked);
    this.checkedRows.set(checked ? this.data.map((x) => x.id) : []);
  }

  protected toggleCheckedRow(id: string, $event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    if (checked) {
      this.checkedRows.update((value) => [...value, id]);
    } else {
      if (this.checkedAll()) {
        //included loaded more rows
        this.checkedRows.set(this.data.map((x) => x.id));
        this.checkedAll.set(false);
      }
      this.checkedRows.update((value) => value.filter((x) => x !== id));
    }
  }

  protected getBulkQueryParam(action: OrganisationTableBulkAction): {
    [key: string]: string[];
  } {
    return {
      [action.queryParamName]: this.checkedRows(),
    };
  }
}
