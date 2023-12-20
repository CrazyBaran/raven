import { trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { fadeIn, fadeOut } from '@app/client/shared/ui';
import { LoaderModule } from '@progress/kendo-angular-indicators';

export type StatusIndicatorState = 'validate' | 'updated' | 'none' | 'failed';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule, LoaderModule],
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [trigger('fadeIn', fadeIn()), trigger('fadeOut', fadeOut())],
})
export class StatusIndicatorComponent {
  @Input() public updatedStateTimeout = 2000;

  protected stateSignal = signal<StatusIndicatorState>('none');

  @Input() public set state(value: StatusIndicatorState) {
    this.stateSignal.set(value);
    if (value === 'updated') {
      setTimeout(() => {
        if (this.stateSignal() === 'updated') {
          this.stateSignal.set('none');
        }
      }, this.updatedStateTimeout);
    }
  }
}
