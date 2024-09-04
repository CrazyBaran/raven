import { inject } from '@angular/core';
import { ManagersService } from '@app/client/managers/data-access';
import { LoadDataMethod, withInfiniteTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { FundManagerContactData } from '@app/rvns-fund-managers';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const managerContactsStore = signalStore(
  withMethods(
    (
      store,
      managersService = inject(ManagersService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: <LoadDataMethod<FundManagerContactData>>((params) =>
        managersService
          .getContacts(
            ngrxStore.selectSignal(routerQuery.selectCurrentId)()!,
            params,
          )
          .pipe(
            map((response) => ({
              total: response.data?.total ?? 0,
              data: response.data?.items ?? [],
            })),
          )),
    }),
  ),
  withInfiniteTable<FundManagerContactData>(),
);
