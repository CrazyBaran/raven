import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterMenuModule } from '@progress/kendo-angular-grid';
import { QuickFilterData } from './quick-filters.interface';

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  imports: [CommonModule, FilterMenuModule],
  templateUrl: './quick-filters.component.html',
  styleUrls: ['./quick-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickFiltersComponent {
  public readonly filtersSection1: QuickFilterData[] = [
    {
      name: 'Created by me',
      value: '',
    },
    {
      name: 'I am tagged',
      value: '',
    },
  ];

  public readonly filtersSection2: QuickFilterData[] = [
    {
      name: 'All Note Types',
      value: '',
    },
    {
      name: 'Company Call',
      value: '',
    },
    {
      name: 'Investor Call',
      value: '',
    },
    {
      name: 'Market Expert Call',
      value: '',
    },
    {
      name: 'Customer Reference Call',
      value: '',
    },
    {
      name: 'Pipeline Call',
      value: '',
    },
    {
      name: 'Loose Note',
      value: '',
    },
  ];
}
