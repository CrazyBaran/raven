import { Route } from '@angular/router';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';

export const PIPELINES_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideOpportunitiesFeature(),
      providePipelinesFeature(),
      provideTagsFeature(),
      provideTemplatesFeature(),
      provideShortlistsFeature(),
    ],
    children: [
      {
        path: '',
        providers: [],
        loadComponent: () =>
          import('@app/client/pipelines/feature/pipelines-board').then(
            (m) => m.PipelinesPageComponent,
          ),
      },
    ],
  },
];
