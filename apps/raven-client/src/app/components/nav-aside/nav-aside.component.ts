import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoginComponent } from '../../pages/login/login.component';
import { collapseAnimation } from './nav-aside.animation';
import { UiNavAsideRoute, UiNavAsideSubRoute } from './nav-aside.interface';

@Component({
  selector: 'app-nav-aside',
  standalone: true,
  imports: [CommonModule, ButtonsModule, RouterModule, LoginComponent],
  templateUrl: './nav-aside.component.html',
  styleUrls: ['./nav-aside.component.scss'],
  animations: [collapseAnimation],
})
export class NavAsideComponent {
  @Input() public routes: UiNavAsideRoute[];
  @Input() public enableToggle: boolean;

  public isOpen = signal(false);
  public openRoute: UiNavAsideRoute | null = null;

  public constructor(
    private readonly msalService: MsalService,
    private readonly router: Router,
  ) {}

  public get subRoutes(): UiNavAsideSubRoute[] | null {
    return this.openRoute?.subRoutes || null;
  }

  public get activeUrl(): string {
    let url = this.router.url;

    if (url.startsWith('/')) {
      url = url.slice(1);
    }

    return url;
  }

  public handleToggleSidebar(state?: boolean): void {
    this.isOpen.update((isOpen) =>
      typeof state === 'boolean' ? state : !isOpen,
    );

    setTimeout(() => {
      if (!this.isOpen()) {
        this.openRoute = null;
      }
    });
  }

  public handleGoBackToMainMenu(): void {
    this.openRoute = null;
  }

  public handleOpenSubRoute(route: UiNavAsideRoute, navigate?: boolean): void {
    if (!route.subRoutes && navigate) {
      this.router.navigateByUrl(route.path);
      this.handleToggleSidebar(false);
      return;
    }

    this.openRoute = route;

    if (!this.isOpen()) {
      this.handleToggleSidebar(true);
    }
  }

  public handleLogout(): void {
    this.msalService.logout();
  }
}
