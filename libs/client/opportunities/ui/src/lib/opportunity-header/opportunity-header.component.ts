import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunity-header.component.html',
  styleUrls: ['./opportunity-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OpportunityHeaderComponent {
  @Input() public theme: 'blue' | 'orange' | 'purple' | 'yellow' | 'red' =
    'blue';

  @Input() public state: 'active' | 'inactive' = 'inactive';

  @HostBinding('class') public get hostClass(): string {
    return `status-indicator--${this.theme} status-indicator--${this.state}`;
  }
}
