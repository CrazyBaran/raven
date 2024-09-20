import { inject } from '@angular/core';
import { ManagersService } from '@app/client/managers/data-access';
import { LoadDataMethod, withInfiniteTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { OrganisationData } from '../../../../../../../rvns-opportunities/src';

export const managerPortfolioStore = signalStore(
  withMethods(
    (
      store,
      managersService = inject(ManagersService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: <LoadDataMethod<OrganisationData>>((params) =>
        managersService
          .getManagerPortfolio(
            ngrxStore.selectSignal(routerQuery.selectCurrentId)()!,
            params,
          )
          .pipe(
            map((response) => {
              return {
                total: response.data?.total ?? 0,
                data: response.data?.items ?? [],
              };
            }),
          )),
    }),
  ),
  withInfiniteTable<OrganisationData>({
    defaultAmountOfRecords: 25,
    take: 25,
  }),
);
