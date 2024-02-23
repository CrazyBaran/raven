import { Route } from '@angular/router';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideOrganisationFeature } from '@app/client/organisations/state';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { provideTagsFeature } from '@app/client/tags/state';

export const SHORTLIST_ROUTES: Route[] = [
  {
    path: '',
    providers: [provideShortlistsFeature(), provideTagsFeature()],
    children: [
      {
        path: '',
        providers: [],
        loadComponent: () =>
          import('@app/client/shortlists/feature/table').then(
            (m) => m.ShortlistTableContainerComponent,
          ),
      },
      {
        path: ':shortlistId',
        providers: [
          provideOrganisationFeature(),
          provideOpportunitiesFeature(),
          providePipelinesFeature(),
        ],
        loadComponent: () =>
          import(
            '@app/client/shortlists/feature/shortlist/organisations/table'
          ).then((m) => m.ShortlistOrganisationsTableComponent),
      },
    ],
  },
];
