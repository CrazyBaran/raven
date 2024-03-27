import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { TilelayoutItemComponent } from '@app/client/shared/ui';

import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import 'hammerjs';
import { organisationEmployeesChartsStore } from './organisation-employees-chart.store';

@Component({
  selector: 'app-organisation-employees-chart',
  standalone: true,
  imports: [
    ChartsModule,
    TilelayoutItemComponent,
    TooltipModule,
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './organisation-employees-chart.component.html',
  styleUrls: ['./organisation-employees-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [organisationEmployeesChartsStore],
})
export class OrganisationChartsComponent {
  public organisationChartsStore = inject(organisationEmployeesChartsStore);

  public getTotalEmployees(): string {
    return (
      this.organisationChartsStore.data().data[0]?.numberOfEmployees || '-'
    );
  }
}
