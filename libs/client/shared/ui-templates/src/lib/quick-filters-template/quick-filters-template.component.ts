import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonGroupModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-quick-filters-template',
  standalone: true,
  imports: [CommonModule, ButtonGroupModule],
  templateUrl: './quick-filters-template.component.html',
  styleUrls: ['./quick-filters-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickFiltersTemplateComponent {}
