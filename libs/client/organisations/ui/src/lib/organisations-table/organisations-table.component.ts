import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClipboardDirective,
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
  TagComponent,
  TagsContainerComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import {
  IsEllipsisActiveDirective,
  TableViewBaseComponent,
} from '@app/client/shared/ui-directives';
import {
  DealLeadsPipe,
  DealTeamPipe,
  ToUrlPipe,
} from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule, RowClassFn } from '@progress/kendo-angular-grid';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import {
  OpportunitiesTableComponent,
  OpportunityRow,
  ToUserTagPipe,
} from '../opportunities-table/opportunities-table.component';

export type OrganisationRow = {
  id: string;
  name: string;
  domains: string[];
  status: {
    name: string;
    color: string;
  };
  score: string;
  specterRank: string;
  domain: string;
  hq: string;
  opportunities: OpportunityRow[];
  shortList: boolean;
};

@Component({
  selector: 'app-organisations-table',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    RxIf,
    RxFor,
    KendoUrlPagingDirective,
    KendoUrlSortingDirective,
    RouterLink,
    ClipboardDirective,
    ToUrlPipe,
    TagComponent,
    UserTagDirective,
    DealLeadsPipe,
    DealTeamPipe,
    IsEllipsisActiveDirective,
    TagsContainerComponent,
    ToUserTagPipe,
    OpportunitiesTableComponent,
  ],
  templateUrl: './organisations-table.component.html',
  styleUrls: ['./organisations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrganisationsTableComponent extends TableViewBaseComponent<OrganisationRow> {
  @ViewChild('grid', { read: ElementRef }) public grid: ElementRef;

  public collapsedRows = signal<string[]>([]);

  public toggleRow(id: string): void {
    if (this.isRowCollapsed(id)) {
      this.grid.nativeElement
        .getElementsByClassName(`row-${id}`)[0]
        .setAttribute('row-active', false);
      this.collapsedRows.update((value) =>
        value.filter((rowId) => rowId !== id),
      );
    } else {
      this.grid.nativeElement
        .getElementsByClassName(`row-${id}`)[0]
        .setAttribute('row-active', true);
      this.collapsedRows.update((value) => [...value, id]);
    }
  }

  public isRowCollapsed(id: string): boolean {
    return this.collapsedRows().includes(id);
  }

  protected rowCallback: RowClassFn = (context) => {
    return `row-${context.dataItem.id}`;
  };
}
