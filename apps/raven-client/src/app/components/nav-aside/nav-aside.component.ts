import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UiNavAsideRoute } from './nav-aside.interface';

@Component({
  selector: 'app-nav-aside',
  standalone: true,
  imports: [CommonModule, ButtonsModule, RouterLink],
  templateUrl: './nav-aside.component.html',
  styleUrls: ['./nav-aside.component.scss'],
  animations: [
    trigger('collapse', [
      state('enter', style({ width: AUTO_STYLE, visibility: AUTO_STYLE })),
      state(
        'void, exit',
        style({
          width: '0',
          visibility: 'hidden',
          paddingLeft: 0,
          paddingRight: 0,
        }),
      ),
      transition(':enter', animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition(
        '* => void, * => leave',
        animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class NavAsideComponent {
  @Input() public routes: UiNavAsideRoute[];
  @Input() public enableToggle: boolean;

  public isOpen = signal(true);

  public handleToggleSidebar(): void {
    console.log('handleToggleSidebar');

    this.isOpen.update((isOpen) => !isOpen);
  }
}
