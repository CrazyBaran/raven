import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencySymbol } from '@app/client/managers/data-access';
import { KendoUrlSortingDirective } from '@app/client/shared/ui';
import {
  InfinityTableViewBaseComponent,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { ThousandSuffixesPipe } from '@app/client/shared/ui-pipes';
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
    ThousandSuffixesPipe,
  ],
  templateUrl: './managers-table.component.html',
  styleUrl: './managers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagersTableComponent extends InfinityTableViewBaseComponent<FundManagerData> {
  public readonly currencySymbol = CurrencySymbol;
  public trackByFn = this.getTrackByFn('id');
}
