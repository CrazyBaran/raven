import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { Route } from '@angular/router';
import { notesProviders } from '@app/client/notes/feaure/shell';
import {
  OpportunitiesEffects,
  OpportunitiesFacade,
  opportunitiesFeature,
} from '@app/client/opportunities/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const opportunitiesProviders: Array<Provider | EnvironmentProviders> = [
  OpportunitiesFacade,
  importProvidersFrom(
    StoreModule.forFeature(opportunitiesFeature),
    EffectsModule.forFeature([OpportunitiesEffects]),
  ),
];

export const OPPORTUNITIES_ROUTES: Route[] = [
  {
    path: '',
    providers: [opportunitiesProviders],
    children: [
      {
        path: ':id',
        providers: [notesProviders],
        loadComponent: () =>
          import('@app/client/opportunities/page/opportunity-details').then(
            (m) => m.OpportunityDetailsPageComponent,
          ),
      },
    ],
  },
];
