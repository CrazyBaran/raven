import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { ToggleMenuButtonComponent } from '@app/client/shared/ui';
import { ClickOutsideDirective, DialogUtil } from '@app/client/shared/util';
import { MsalService } from '@azure/msal-angular';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BadgeModule } from '@progress/kendo-angular-indicators';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { map, startWith } from 'rxjs';
import { LoginComponent } from '../../pages/login/login.component';
import { SidebarActionButtonComponent } from '../sidebar-action-button/sidebar-action-button.component';
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
    ToggleMenuButtonComponent,
    PopupModule,
    ClickOutsideDirective,
    SidebarActionButtonComponent,
    BadgeModule,
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

  public activeUrl = toSignal(
    this.router.events.pipe(
      startWith(this.router.url),
      map(() => {
        let url = this.router.url;

        if (url.startsWith('/')) {
          url = url.slice(1);
        }

        return url;
      }),
    ),
  );

  public constructor(
    private readonly msalService: MsalService,
    private readonly router: Router,
    private readonly activedRoute: ActivatedRoute,
    private readonly shelfFacade: ShelfStoreFacade,
  ) {}

  public get subRoutes(): UiNavAsideSubRoute[] | null {
    return this.openRoute()?.subRoutes || null;
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
    if (!route.subRoutes && (navigate || route.navigate)) {
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

  public handleNewReminder(): void {
    this.router.navigate([], {
      relativeTo: this.activedRoute,
      queryParams: { [DialogUtil.queryParams.createReminder]: true },
      skipLocationChange: true,
    });
  }

  public handleToggleUserDetails(): void {
    this.isOpen.set(true);

    this.visibleUserDetails.update((value) => !value);
  }

  public handleLogout(): void {
    this.msalService.logout();
  }
}
