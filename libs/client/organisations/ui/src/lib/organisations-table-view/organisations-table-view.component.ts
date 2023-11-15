import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import {
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
} from '@app/client/shared/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridDataResult, GridModule } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';

//TODO: move to model library and reuse shared models
export type OrganisationRow = {
  id?: string;
  name: string;
  domains: string[];
  opportunities: {
    tag: { name: string };
    id: string;
    stageColor: string;
    stage: {
      id: string;
      displayName: string;
    };
    fields: {
      displayName: string;
      value: string | number | object | object[];
    }[];
  }[];
};

@Pipe({
  name: 'stageColor',
  standalone: true,
})
export class StageColorPipe implements PipeTransform {
  public transform(stageId: string): string {
    // return random color
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}

@Pipe({
  name: 'expandableList',
  standalone: true,
})
export class ExpandableListPipe implements PipeTransform {
  public transform(
    organisationRow: OrganisationRow,
    collapsedRows: string[],
  ): OrganisationRow['opportunities'] {
    return collapsedRows.includes(organisationRow.id!)
      ? organisationRow.opportunities.slice(0, 1)
      : organisationRow.opportunities;
  }
}

@Component({
  selector: 'app-organisations-table-view',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    RxIf,
    RxFor,
    ExpandableListPipe,
    StageColorPipe,
    KendoUrlPagingDirective,
    KendoUrlSortingDirective,
  ],
  templateUrl: './organisations-table-view.component.html',
  styleUrls: ['./organisations-table-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableViewComponent {
  @Input() public organisations: OrganisationRow[];
  @Input() public isLoading: boolean;
  @Input({ transform: numberAttribute }) public total: number;
  @Input({ transform: numberAttribute }) public take: number;
  @Input({ transform: numberAttribute }) public skip: number;

  @Input() public field: string;
  @Input() public dir = 'asc';

  public collapsedRows = signal<string[]>([]);

  public get data(): GridDataResult {
    return {
      data: this.organisations,
      total: this.total,
    };
  }

  public get sort(): SortDescriptor[] {
    return this.field
      ? [{ field: this.field, dir: this.dir as 'asc' | 'desc' }]
      : [];
  }

  public toggleRow(id: string): void {
    if (this.isRowCollapsed(id)) {
      this.collapsedRows.update((value) => value.filter((id) => id !== id));
    } else {
      this.collapsedRows.update((value) => [...value, id]);
    }
  }

  public isRowCollapsed(id: string): boolean {
    return this.collapsedRows().includes(id);
  }
}
