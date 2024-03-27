import { inject } from '@angular/core';
import {
  EmployeeChartData,
  OrganisationsService,
} from '@app/client/organisations/data-access';
import { LoadDataMethod, withChart } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const organisationEmployeesChartsStore = signalStore(
  withMethods(
    (
      store,
      organisationsService = inject(OrganisationsService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: <LoadDataMethod<EmployeeChartData>>((params) =>
        organisationsService
          .getEmployeesChartData(
            ngrxStore.selectSignal(routerQuery.selectCurrentOrganisationId)()!,
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
  withChart<EmployeeChartData>(),
);
