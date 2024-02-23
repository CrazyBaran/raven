import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClipboardService,
  TagsContainerComponent,
} from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { ToUserTagPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownAction,
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridItem, GridModule } from '@progress/kendo-angular-grid';

export type OpportunityRow = {
  id: string;
  companyId: string;
  name: string;
  status: {
    name: string;
    color: string;
  };
  dealLeads: string[];
  dealTeam: string[];
  updatedAt: string;
  actionData: DropdownAction[];
};

@Component({
  selector: 'app-opportunities-table',
  standalone: true,
  imports: [
    GridModule,
    TagsContainerComponent,
    IsEllipsisActiveDirective,
    DatePipe,
    ButtonModule,
    ToUserTagPipe,
    RouterLink,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './opportunities-table.component.html',
  styleUrls: ['./opportunities-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OpportunitiesTableComponent {
  @Input() public rows: OpportunityRow[] = [];

  public constructor(private clipboardService: ClipboardService) {}

  protected trackByFn: TrackByFunction<GridItem> = (index, item: GridItem) =>
    'id' in item ? item.id : index;

  protected getActionData(
    opportunity: OpportunityRow,
  ): DropdownbuttonNavigationModel {
    const fullUrlToOpportunity = `${window.location.origin}${this.getRouterLink(
      opportunity,
    ).join('/')}`;

    return {
      actions: [
        ...opportunity.actionData,
        {
          text: 'Copy Link to Opportunity Details',
          click: (): void => {
            this.clipboardService.copyToClipboard(fullUrlToOpportunity);
          },
        },
      ],
    };
  }

  protected getRouterLink(opportunity: OpportunityRow): string[] {
    return [
      '/companies',
      opportunity.companyId,
      'opportunities',
      opportunity.id,
    ];
  }
}
