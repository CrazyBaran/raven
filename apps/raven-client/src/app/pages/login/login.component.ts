import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';

export const getAuthState = createFeatureSelector('auth');
export const selectUserData = createSelector(
  getAuthState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (state: any) => state.user,
);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private router = inject(Router);
  private store = inject(Store);

  public constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: ActivatedRoute,
  ) {
    this.store
      .select(selectUserData)
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }

  public login(): void {
    const authRequest = { ...this.msalGuardConfig.authRequest };

    this.route.queryParams.subscribe((params) => {
      const redirectUrl = params['redirectUrl'] ?? '/';
      this.msalService.loginRedirect({
        prompt: 'select_account',
        redirectStartPage: redirectUrl,
        ...authRequest,
      } as RedirectRequest);
    });
  }

  public logout(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: '/',
      onRedirectNavigate: () => {
        window.localStorage.clear();
        window.sessionStorage.clear();
        return false;
      },
    });
  }

  public isLogged(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }
}
