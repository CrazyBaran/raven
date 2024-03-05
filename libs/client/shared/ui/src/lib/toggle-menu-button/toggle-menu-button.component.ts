import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type ToggleMenuButtonDirection = 'left' | 'right';

@Component({
  selector: 'ui-toggle-menu-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toggle-menu-button.component.html',
  styleUrls: ['./toggle-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleMenuButtonComponent {
  @Output() public directionChange =
    new EventEmitter<ToggleMenuButtonDirection>();

  @Input() public direction: ToggleMenuButtonDirection;

  public toggleDirection(): void {
    this.direction = this.direction === 'left' ? 'right' : 'left';
    this.directionChange.emit(this.direction);
  }
}
