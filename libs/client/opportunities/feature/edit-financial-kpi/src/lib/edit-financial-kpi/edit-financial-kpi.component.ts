import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-edit-financial-kpi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-financial-kpi.component.html',
  styleUrl: './edit-financial-kpi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFinancialKpiComponent {}
