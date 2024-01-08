import { Route } from '@angular/router';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideWebsocketEffects } from '@app/client/core/websockets';

export const PIPELINES_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideWebsocketEffects(),
      provideOpportunitiesFeature(),
      providePipelinesFeature()
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
