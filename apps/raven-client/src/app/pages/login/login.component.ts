import { Component, Inject } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: ActivatedRoute,
  ) {}

  public login(): void {
    const authRequest = { ...this.msalGuardConfig.authRequest };

    this.route.queryParams.subscribe((params) => {
      const redirectUrl = params['redirectUrl'] ?? '/';
      this.msalService.loginRedirect({
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
