import { inject } from '@angular/core';
import {
  OrganisationNews,
  OrganisationsService,
} from '@app/client/organisations/data-access';
import { LoadDataMethod, withInfiniteTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const organisationNewsTableStore = signalStore(
  withMethods(
    (
      store,
      organisationService = inject(OrganisationsService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: getLoadNewsData(
        organisationService,
        ngrxStore.selectSignal(routerQuery.selectCurrentOrganisationId)()!,
      ),
    }),
  ),
  withInfiniteTable<OrganisationNews>({ take: 10 }),
);

export const getLoadNewsData =
  (
    organisationService: OrganisationsService,
    organisationId: string,
  ): LoadDataMethod<OrganisationNews> =>
  (params) =>
    organisationService.getNews(organisationId, params).pipe(
      map((response) => ({
        total: response.data?.total ?? 0,
        data:
          response.data?.items.map((item) => {
            const newsArticleUrl = item.newsArticleUrl
              ? new URL(item.newsArticleUrl).hostname.replace('www.', '')
              : '';

            return { ...item, domain: newsArticleUrl };
          }) ?? [],
      })),
    );
