import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  RelationStrengthColor,
  RelationStrengthName,
} from '@app/client/managers/data-access';
import { KendoUrlSortingDirective } from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { FundManagerData } from '@app/rvns-fund-managers';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-managers-table',
  standalone: true,
  imports: [
    GridModule,
    KendoUrlSortingDirective,
    ShowTooltipIfClampedDirective,
    TooltipModule,
  ],
  templateUrl: './managers-table.component.html',
  styleUrl: './managers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagersTableComponent extends InfinityTableViewBaseComponent<FundManagerData> {
  public trackByFn = this.getTrackByFn('id');

  public relationStrength(value: string): { name: string; color: string } {
    return {
      name: RelationStrengthName[value],
      color: RelationStrengthColor[value],
    };
  }
}
