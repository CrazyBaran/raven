import { Route } from '@angular/router';
import { provideWebsocketEffects } from '@app/client/core/websockets';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';

export const PIPELINES_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideWebsocketEffects(),
      provideOpportunitiesFeature(),
      providePipelinesFeature(),
      provideTagsFeature(),
      provideTemplatesFeature(),
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
