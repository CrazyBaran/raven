import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ClipboardDirective,
  KendoUrlSortingDirective,
  TagsContainerComponent,
} from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  IsEllipsisActiveDirective,
} from '@app/client/shared/ui-directives';
import { ToUserTagPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  GridModule,
  RowClassArgs,
  RowClassFn,
} from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { shortlistPipes } from '../is-personal-shortlist.pipe';

export interface ShortListTableRow {
  id: string;
  name: string;
  description: string;
  companies: string;
  inPipeline: string;
  contributors: string[];
  updatedAt: string;
  actionsModel?: DropdownbuttonNavigationModel;
  type: 'custom' | 'personal' | 'main' | 'my';
}

@Component({
  selector: 'app-shortlist-table',
  standalone: true,
  imports: [
    GridModule,
    KendoUrlSortingDirective,
    RouterLink,
    IsEllipsisActiveDirective,
    TooltipModule,
    ButtonModule,
    DropdownButtonNavigationComponent,
    TagsContainerComponent,
    ToUserTagPipe,
    DatePipe,
    ClipboardDirective,
    shortlistPipes,
  ],
  templateUrl: './shortlist-table.component.html',
  styleUrl: './shortlist-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ShortlistTableComponent extends InfinityTableViewBaseComponent<ShortListTableRow> {
  public trackByFn = this.getTrackByFn('id');

  public getShortlistUrl(shortlistId: string): string {
    return `${window.location.href}/${shortlistId}`;
  }

  public rowCallback: RowClassFn = (context: RowClassArgs) => {
    return (context.dataItem as ShortListTableRow).type === 'my'
      ? { 'my-shortlist': true }
      : {};
  };
}
