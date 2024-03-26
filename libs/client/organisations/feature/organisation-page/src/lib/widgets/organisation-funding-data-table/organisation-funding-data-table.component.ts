import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { WhenDatePipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import 'hammerjs';
import { organisationFundingDataTableStore } from './organisation-funding-data-table.store';

@Component({
  selector: 'app-organisation-funding-data-table',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    GridModule,
    TooltipModule,
    ButtonModule,
    WhenDatePipe,
    NgOptimizedImage,
    NgClass,
    CurrencyPipe,
    DatePipe,
    ChartsModule,
  ],
  templateUrl: './organisation-funding-data-table.component.html',
  styleUrls: ['./organisation-funding-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationFundingDataTableStore],
})
export class OrganisationFundingDataTableComponent {
  public organisationFundingDataStore = inject(
    organisationFundingDataTableStore,
  );

  public defaults = {
    labels: {
      rotation: 0,
      dateFormats: {
        years: 'yyyy',
      },
    },
    type: 'Date',
    baseUnit: 'years',
  };

  public loadMore(): void {
    this.organisationFundingDataStore.loadMore();
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };
}
