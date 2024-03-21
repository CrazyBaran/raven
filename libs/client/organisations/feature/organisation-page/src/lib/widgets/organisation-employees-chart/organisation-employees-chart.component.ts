import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TilelayoutItemComponent } from '@app/client/shared/ui';

import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationEmployeesChartsStore } from './organisation-employees-chart.store';

@Component({
  selector: 'app-organisation-employees-chart',
  standalone: true,
  imports: [
    ChartsModule,
    CommonModule,
    TilelayoutItemComponent,
    GridModule,
    NgOptimizedImage,
    TooltipModule,
    ButtonModule,
    NgClass,
  ],
  templateUrl: './organisation-employees-chart.component.html',
  styleUrls: ['./organisation-employees-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [organisationEmployeesChartsStore],
})
export class OrganisationChartsComponent {
  public organisationChartsStore = inject(organisationEmployeesChartsStore);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
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

  public getTotalEmployees(): string {
    const chartData = this.organisationChartsStore.chartData().data;
    return chartData[chartData.length - 1]?.numberOfEmployees || '-';
  }
}
