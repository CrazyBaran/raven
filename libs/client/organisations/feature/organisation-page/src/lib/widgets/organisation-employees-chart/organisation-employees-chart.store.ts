import { computed, inject } from '@angular/core';
import { LoadDataMethod, withChart } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  EmployeeChartData,
  OrganisationsService,
} from '../../../../../../data-access/src';

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
  withComputed(({ data }) => ({
    chartData: computed(() => ({
      ...data(),
      data: data()
        .data.slice()
        .reverse()
        .map((item) => ({
          ...item,
          observationDate: item.observationDate,
          numberOfEmployees: item.numberOfEmployees,
        })),
    })),
  })),
);
