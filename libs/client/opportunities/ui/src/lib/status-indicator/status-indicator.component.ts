import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatusIndicatorComponent {
  @Input() public theme: 'blue' | 'orange' | 'purple' | 'yellow' | 'red' =
    'blue';

  @Input() public state: 'active' | 'inactive' = 'inactive';

  @Output() public statusClick = new EventEmitter();

  @HostBinding('class') public get hostClass(): string {
    return `status-indicator--${this.theme} status-indicator--${this.state}`;
  }
}
