import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private route: ActivatedRoute,
  ) {
    console.log(this.msalService.instance.getActiveAccount());
    console.log(this.msalService.instance.getTokenCache());
    console.log(this.msalService.instance.getConfiguration());
    console.log(this.msalService.instance.getAllAccounts());
  }

  public login(): void {
    const authRequest = { ...this.msalGuardConfig.authRequest };

    this.route.queryParams.subscribe((params) => {
      console.log('Params: ', params);

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
