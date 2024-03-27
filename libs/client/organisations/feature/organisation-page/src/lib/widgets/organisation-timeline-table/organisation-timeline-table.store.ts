import { computed, inject } from '@angular/core';
import { OrganisationsService } from '@app/client/organisations/data-access';
import {
  LoadDataMethod,
  withDateRangeInfiniteTable,
} from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { OrganisationInteraction } from '../../../../../../data-access/src/lib/models/interaction.model';
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
    endTime: new Date(),
    daysInterval: TIMELINE_DAYS_INTERVAL,
  }),
  withComputed(({ data }) => ({
    chartData: computed(() => ({
      ...data(),
      data: data()
        .data.slice()
        .reverse()
        .map((item) => ({ ...item })),
    })),
  })),
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