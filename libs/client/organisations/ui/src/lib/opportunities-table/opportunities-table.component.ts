import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { TagsContainerComponent } from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridItem, GridModule } from '@progress/kendo-angular-grid';
import { ToUserTagPipe } from '../organisations-table-view-legacy/organisations-table-view.component';

export type OpportunityRow = {
  id: string;
  name: string;
  status: {
    name: string;
    color: string;
  };
  dealLeads: string[];
  dealTeam: string[];
  updatedAt: string;
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
  ],
  templateUrl: './opportunities-table.component.html',
  styleUrls: ['./opportunities-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OpportunitiesTableComponent {
  @Input() public rows: OpportunityRow[] = [];

  protected trackByFn: TrackByFunction<GridItem> = (index, item) =>
    'id' in item ? item.id : index;
}
