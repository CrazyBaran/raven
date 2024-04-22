import { inject } from '@angular/core';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AccountInfo } from '@azure/msal-node';
import { createEffect } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthActions } from './auth.actions';

export const syncAuthState = createEffect(
  (
    msalBroadcastService = inject(MsalBroadcastService),
    msalService = inject(MsalService),
    userService = inject(UserService),
  ) => {
    return msalBroadcastService.inProgress$.pipe(
      filter((status) => status == InteractionStatus.None),
      map(() => {
        const instance = msalService.instance;
        const activeAccount: AccountInfo | null = instance.getActiveAccount();
        const accounts: AccountInfo[] = instance.getAllAccounts();
        if (activeAccount != null) return activeAccount;
        if (accounts.length > 0) {
          const [firstAccount] = accounts;
          instance.setActiveAccount(firstAccount);
          return firstAccount;
        }
        return null;
      }),
      distinctUntilChangedDeep(),
      switchMap(() => userService.me()),
      map((account) => {
        return AuthActions.syncAuthState({
          email: account?.data?.email || '',
          name: account?.data?.name || '',
          id: account?.data?.id || '',
        });
      }),
    );
  },
  {
    functional: true,
  },
);
