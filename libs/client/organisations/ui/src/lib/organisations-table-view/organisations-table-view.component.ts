import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
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
  ],
  templateUrl: './organisations-table-view.component.html',
  styleUrls: ['./organisations-table-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableViewComponent {
  @Input() public organisations: OrganisationRow[];
  @Input() public isLoading: boolean;

  public collapsedRows = signal<string[]>([]);

  public toggleRow(id: string): void {
    if (this.isRowColapsed(id)) {
      this.collapsedRows.update((value) => value.filter((id) => id !== id));
    } else {
      this.collapsedRows.update((value) => [...value, id]);
    }
  }

  public isRowColapsed(id: string): boolean {
    return this.collapsedRows().includes(id);
  }
}
