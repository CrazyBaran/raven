import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BadgeComponent, BadgeStyle } from '@app/client/shared/ui';

@Component({
  selector: 'app-financial-state-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './financial-state-badge.component.html',
  styleUrls: ['./financial-state-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialStateBadgeComponent {
  @Input({ required: true }) public state: 'great' | 'good' | 'average';

  protected get badgeStyle(): BadgeStyle {
    return {
      backgroundColor:
        this.state === 'great'
          ? 'var(--informational-success)'
          : this.state === 'good'
          ? 'var(--informational-success-50)'
          : 'var(--informational-warning)',
    };
  }
}
