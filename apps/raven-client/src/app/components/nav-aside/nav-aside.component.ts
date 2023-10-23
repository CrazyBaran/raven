import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShelfStoreFacade } from '@app/rvnc-shelf';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAsideComponent {
  @Input() public routes: UiNavAsideRoute[];

  public shelfFacade = inject(ShelfStoreFacade);

  public isOpen = signal(false);
  public openRoute: WritableSignal<UiNavAsideRoute | null> = signal(null);

  public constructor(
    private readonly msalService: MsalService,
    private readonly router: Router,
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

  public handleLogout(): void {
    this.msalService.logout();
  }
}
