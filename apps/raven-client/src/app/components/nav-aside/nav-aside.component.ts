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
import { Router, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoginComponent } from '../../pages/login/login.component';
import { UiNavAsideRoute } from './nav-aside.interface';

@Component({
  selector: 'app-nav-aside',
  standalone: true,
  imports: [CommonModule, ButtonsModule, RouterModule, LoginComponent],
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

  public constructor(
    private readonly router: Router,
    private readonly msalService: MsalService,
  ) {}

  public handleToggleSidebar(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  public handleChangeRoute(path: string): void {
    this.router.navigateByUrl(path);
  }

  public handleLogout(): void {
    this.msalService.logout();
  }
}
