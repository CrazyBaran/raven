import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { MsalService } from '@azure/msal-angular';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { LoginComponent } from '../../pages/login/login.component';
import { collapseAnimation } from './nav-aside.animation';
import { UiNavAsideRoute, UiNavAsideSubRoute } from './nav-aside.interface';

@Component({
  selector: 'app-nav-aside',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsModule,
    RouterModule,
    LoginComponent,
    TooltipModule,
  ],
  templateUrl: './nav-aside.component.html',
  styleUrls: ['./nav-aside.component.scss'],
  animations: [collapseAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAsideComponent {
  @Input() public routes: UiNavAsideRoute[];

  public isOpen = signal(false);
  public visibleUserDetails = signal(false);
  public openRoute: WritableSignal<UiNavAsideRoute | null> = signal(null);

  public readonly userOptions: {
    name: string;
    icon: string;
    action?: () => void;
  }[] = [
    {
      name: 'Support',
      icon: 'fa-regular fa-circle-info',
    },
    {
      name: 'Settings',
      icon: 'fa-solid fa-gear',
    },
    {
      name: 'Logout',
      icon: 'fa-solid fa-arrow-right-to-line',
      action: (): void => this.handleLogout(),
    },
  ];

  public constructor(
    private readonly msalService: MsalService,
    private readonly router: Router,
    private readonly shelfFacade: ShelfStoreFacade,
  ) {}

  public get subRoutes(): UiNavAsideSubRoute[] | null {
    return this.openRoute()?.subRoutes || null;
  }

  public get activeUrl(): string {
    let url = this.router.url;

    if (url.startsWith('/')) {
      url = url.slice(1);
    }

    return url;
  }

  public get activeUser(): string {
    return this.msalService.instance.getActiveAccount()?.name || '';
  }

  public get userInitials(): string {
    return this.activeUser
      .split(' ')
      .slice(0, 2)
      .map((char) => char[0])
      .join('');
  }

  public handleToggleSidebar(state?: boolean): void {
    this.isOpen.update((isOpen) =>
      typeof state === 'boolean' ? state : !isOpen,
    );

    setTimeout(() => {
      if (!this.isOpen()) {
        this.openRoute.set(null);
      }
    });
  }

  public handleGoBackToMainMenu(): void {
    this.openRoute.set(null);
  }

  public async handleOpenSubRoute(
    route: UiNavAsideRoute,
    navigate?: boolean,
  ): Promise<void> {
    if (!route.subRoutes && navigate) {
      await this.router.navigateByUrl(route.path);

      this.handleToggleSidebar(false);
      return;
    }

    this.openRoute.set(route);

    if (!this.isOpen()) {
      this.handleToggleSidebar(true);
    }
  }

  public handleOpenNotepad(): void {
    this.shelfFacade.openNotepad();
  }

  public handleToggleUserDetails(): void {
    this.isOpen.set(true);

    this.visibleUserDetails.update((value) => !value);
  }

  public handleLogout(): void {
    this.msalService.logout();
  }
}
