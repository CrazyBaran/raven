import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KendoUrlSortingDirective } from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { FundManagerData } from '@app/rvns-fund-managers';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { RelationshipStrengthComponent } from '../relationship-strength/relationship-strength.component';

@Component({
  selector: 'app-managers-table',
  standalone: true,
  imports: [
    RouterLink,
    GridModule,
    KendoUrlSortingDirective,
    ShowTooltipIfClampedDirective,
    TooltipModule,
    RelationshipStrengthComponent,
  ],
  templateUrl: './managers-table.component.html',
  styleUrl: './managers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagersTableComponent extends InfinityTableViewBaseComponent<FundManagerData> {
  public trackByFn = this.getTrackByFn('id');
}
