import { inject } from '@angular/core';
import {
  OrganisationInteraction,
  OrganisationsService,
} from '@app/client/organisations/data-access';
import {
  LoadDataWithExtrasMethod,
  withDateRangeInfiniteTable,
} from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { TIMELINE_DAYS_INTERVAL } from './organisation-timeline-table.const';

export const organisationTimelineTableStore = signalStore(
  withMethods(
    (
      store,
      organisationService = inject(OrganisationsService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: loadTimelineData(
        organisationService,
        ngrxStore.selectSignal(routerQuery.selectCurrentOrganisationId)()!,
      ),
    }),
  ),
  withDateRangeInfiniteTable<OrganisationInteraction>({
    daysInterval: TIMELINE_DAYS_INTERVAL,
  }),
);

export const loadTimelineData =
  (
    organisationService: OrganisationsService,
    organisationId: string,
  ): LoadDataWithExtrasMethod<OrganisationInteraction> =>
  (params) =>
    organisationService.getTimelineData(organisationId, params).pipe(
      map((response) => {
        return {
          total: response.data?.total ?? 500,
          data: response.data?.items ?? [],
          extras: response.data?.nextInteraction!,
        };
      }),
    );
