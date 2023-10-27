import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'auth-azure-ad-sso',
  templateUrl: './azure-ad-sso.component.html',
  styleUrls: ['./azure-ad-sso.component.scss'],
})
export class AzureAdSsoComponent implements OnInit, OnDestroy {
  public _destroyed$ = new Subject();
  public constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
  ) {}

  public ngOnInit(): void {
    this.broadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS,
        ),
        takeUntil(this._destroyed$),
      )
      .subscribe((event: EventMessage) => {
        console.log('login success');
      });

    this.broadcastService.msalSubject$
      .pipe(takeUntil(this._destroyed$))
      .subscribe((event: EventMessage) => {
        console.log(event.eventType + ' ' + event.payload);
        this.authService.instance.getActiveAccount();
        console.log(this.authService.instance.getAllAccounts());
      });
  }

  public ngOnDestroy(): void {
    this._destroyed$.next(null);
    this._destroyed$.complete();
  }

  public login(): void {
    this.authService.loginRedirect();
  }

  public logout(): void {
    this.authService.logoutRedirect();
  }
}
