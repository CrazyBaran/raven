import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CanActivateGuard {
  public constructor(
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      switchMap(() => {
        if (this.msalService.instance.getAllAccounts().length > 0) {
          return of(true);
        }

        console.log(state);
        this.router.navigate(['/login'], {
          queryParams: { redirectUrl: state.url },
        });
        return of(false);
      }),
    );
  }
}
