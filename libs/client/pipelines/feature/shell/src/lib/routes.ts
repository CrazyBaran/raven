import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { provideWebsocketEffects } from '@app/client/core/websockets';
import {
  OpportunitiesEffects,
  OpportunitiesFacade,
  opportunitiesReducer,
} from '@app/client/opportunities/data-access';
import {
  PipelinesEffects,
  pipelinesReducer,
} from '@app/client/pipelines/state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

export const PIPELINES_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideWebsocketEffects(),
      OpportunitiesFacade,
      importProvidersFrom(
        StoreModule.forFeature('opportunities', opportunitiesReducer),
        EffectsModule.forFeature([OpportunitiesEffects]),
        StoreModule.forFeature('pipelines', pipelinesReducer),
        EffectsModule.forFeature([PipelinesEffects]),
      ),
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
