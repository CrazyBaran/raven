import { inject } from '@angular/core';
import {
  OrganisationInteraction,
  OrganisationsService,
} from '@app/client/organisations/data-access';
import {
  LoadDataMethod,
  LoadParamMethod,
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
      preloadEndTime: loadLatestInteractionDate(
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
  ): LoadDataMethod<OrganisationInteraction> =>
  (params) =>
    organisationService.getTimelineData(organisationId, params).pipe(
      map((response) => ({
        total: response.data?.total ?? 500,
        data: response.data?.items ?? [],
      })),
    );

export const loadLatestInteractionDate =
  (
    organisationService: OrganisationsService,
    organisationId: string,
  ): LoadParamMethod<Date | null> =>
  () => {
    return organisationService.getLatestInteractionDate(organisationId).pipe(
      map((response) => ({
        data: response.data ?? null,
      })),
    );
  };
