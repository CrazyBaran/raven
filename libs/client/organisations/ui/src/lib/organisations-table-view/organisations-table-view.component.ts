import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClipboardDirective,
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
  TagComponent,
  TagItem,
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
import { GridModule } from '@progress/kendo-angular-grid';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityTeamData } from '@app/rvns-opportunities';

//TODO: move to model library and reuse shared models
export type OrganisationRow = {
  id?: string;
  name: string;
  domains: string[];
  opportunities: {
    tag?: { name: string } | undefined | null;
    id?: string;
    stageColor: string;
    stage?: {
      id: string;
      displayName: string;
    };
    fields?: {
      displayName: string;
      value: string | number | object | object[];
    }[];
    team?: OpportunityTeamData;
  }[];
};

@Pipe({
  name: 'toUserTag',
  standalone: true,
})
export class ToUserTagPipe implements PipeTransform {
  public transform(users: string[]): TagItem[] {
    return users.map((user) => ({
      name: user,
      icon: 'fa-solid fa-user',
      id: user,
      size: 'medium',
    }));
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
  ],
  templateUrl: './organisations-table-view.component.html',
  styleUrls: ['./organisations-table-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableViewComponent extends TableViewBaseComponent<OrganisationRow> {
  public collapsedRows = signal<string[]>([]);

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
