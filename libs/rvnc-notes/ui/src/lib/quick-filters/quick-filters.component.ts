import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterMenuModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  imports: [CommonModule, FilterMenuModule],
  templateUrl: './quick-filters.component.html',
  styleUrls: ['./quick-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickFiltersComponent {}
