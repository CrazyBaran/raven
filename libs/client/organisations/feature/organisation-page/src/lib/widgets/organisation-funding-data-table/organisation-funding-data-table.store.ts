import { computed, inject } from '@angular/core';
import {
  OrganisationFundingData,
  OrganisationsService,
} from '@app/client/organisations/data-access';
import { LoadDataMethod, withInfiniteTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const organisationFundingDataTableStore = signalStore(
  withMethods(
    (
      store,
      organisationService = inject(OrganisationsService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: getLoadFundingData(
        organisationService,
        ngrxStore.selectSignal(routerQuery.selectCurrentOrganisationId)()!,
      ),
    }),
  ),
  withInfiniteTable<OrganisationFundingData>({ take: 500 }),
  withComputed(({ data }) => ({
    chartData: computed(() => ({
      ...data(),
      data: data()
        .data.slice()
        .reverse()
        .map((item, i, allItems) => ({
          ...item,
          amountInUsd: allItems
            .slice(0, i)
            .reduce(
              (acc, curr) => acc + curr.amountInUsd ?? 0,
              item.amountInUsd ?? 0,
            )
            .toFixed(2),
        })),
    })),
  })),
);

export const getLoadFundingData =
  (
    organisationService: OrganisationsService,
    organisationId: string,
  ): LoadDataMethod<OrganisationFundingData> =>
  (params) =>
    organisationService.getFundingData(organisationId, params).pipe(
      map((response) => ({
        total: response.data?.total ?? 0,
        data: response.data?.items ?? [],
      })),
    );
