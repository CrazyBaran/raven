import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { ToggleMenuButtonComponent } from '@app/client/shared/ui';
import { ClickOutsideDirective, DialogUtil } from '@app/client/shared/util';
import { MsalService } from '@azure/msal-angular';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BadgeModule } from '@progress/kendo-angular-indicators';
import { PopupModule } from '@progress/kendo-angular-popup';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { map, startWith } from 'rxjs';
import { LoginComponent } from '../../pages/login/login.component';
import { SidebarActionButtonComponent } from '../sidebar-action-button/sidebar-action-button.component';
import {
  collapseAnimation,
  delayedFadeInAnimation,
} from './nav-aside.animation';
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
    PopoverModule,
    ToggleMenuButtonComponent,
    PopupModule,
    ClickOutsideDirective,
    SidebarActionButtonComponent,
    BadgeModule,
    NgOptimizedImage,
  ],
  templateUrl: './nav-aside.component.html',
  styleUrls: ['./nav-aside.component.scss'],
  animations: [collapseAnimation, delayedFadeInAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAsideComponent {
  @Input() public routes: UiNavAsideRoute[];

  public isOpen = signal(false);
  public visibleUserDetails = signal(false);
  public openRoute: WritableSignal<UiNavAsideRoute | null> = signal(null);

  public openRouteSubroutes: { [key: string]: boolean } = {};
  public readonly userOptions: {
    name: string;
    icon: string;
    action?: () => void;
  }[] = [
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

  public getContextData(anchor: Element): UiNavAsideRoute {
    const routeIndex = parseInt(anchor.id.split('menu-popover-index-')[1]);
    return this.routes?.[routeIndex];
  }

  public getPopoverId(route: UiNavAsideRoute): string {
    return `menu-popover-index-${this.routes.indexOf(route)}`;
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
    if (!route.subRoutes || navigate || route.navigate) {
      const extras = {
        queryParams: {},
      };
      if (route.queryParams) {
        extras.queryParams = route.queryParams;
      }
      await this.router.navigate([route.path], extras);

      this.handleToggleSidebar(false);
      return;
    }

    this.openRoute.set(route);

    if (!this.isOpen()) {
      this.handleToggleSidebar(true);
      this.handleOpenRouteSubroutes(route);
    }
  }

  public isActiveNotExact(path: string): boolean {
    const allMatching = [];
    const activeWithoutQuery = this.activeUrl()!.split('?')[0];
    if (this.activeUrl()!.includes(path)) {
      allMatching.push(path);
    }
    const filteredRoutes = this.routes?.filter(
      (r) => r.path !== path && !r.exact,
    );
    for (const route of filteredRoutes) {
      if (route.path.includes(activeWithoutQuery)) {
        allMatching.push(route.path);
      }
    }

    const matched = allMatching.find((m) => m === activeWithoutQuery);
    const isActive = matched
      ? path === matched
      : this.activeUrl()!.includes(path);

    return isActive;
  }

  public sidebarClicked($event: Event): void {
    if (($event?.target as HTMLElement).localName === 'div') {
      this.handleToggleSidebar();
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
      queryParamsHandling: 'merge',
    });
  }

  public handleToggleUserDetails(): void {
    this.isOpen.set(true);
  }

  public handleToggleRouteSubroutes(route: UiNavAsideRoute): void {
    this.openRouteSubroutes[route.name] = !this.openRouteSubroutes[route.name];
  }

  public handleOpenRouteSubroutes(route: UiNavAsideRoute): void {
    this.openRouteSubroutes[route.name] = true;
  }

  public visibleRouteSubroute(route: UiNavAsideRoute): boolean {
    return !!this.openRouteSubroutes[route.name];
  }

  public handleLogout(): void {
    this.msalService.logout();
  }
}
