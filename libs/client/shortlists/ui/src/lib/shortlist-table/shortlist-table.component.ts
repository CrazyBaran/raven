import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToUserTagPipe } from '@app/client/organisations/ui';
import {
  ClipboardDirective,
  KendoUrlSortingDirective,
  TagsContainerComponent,
} from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  IsEllipsisActiveDirective,
} from '@app/client/shared/ui-directives';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';

export interface ShortListTableRow {
  id: string;
  name: string;
  description: string;
  companies: string;
  inPipeline: string;
  contributors: string[];
  updatedAt: string;
  actionsModel?: DropdownbuttonNavigationModel;
}

@Component({
  selector: 'app-shortlist-table',
  standalone: true,
  imports: [
    ClipboardDirective,
    GridModule,
    KendoUrlSortingDirective,
    TagsContainerComponent,
    ButtonModule,
    DatePipe,
    ToUserTagPipe,
    IsEllipsisActiveDirective,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './shortlist-table.component.html',
  styleUrl: './shortlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistTableComponent extends InfinityTableViewBaseComponent<ShortListTableRow> {
  public getShortlistUrl(shortlistId: string): string {
    return `${window.location.href}?shortlist=${shortlistId}`;
  }
}
