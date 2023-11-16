import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { Routes } from '@angular/router';
import {
  OpportunitiesEffects,
  opportunitiesReducer,
} from '@app/client/opportunities/data-access';
import {
  OrganisationsEffects,
  OrganisationsFeature,
} from '@app/client/organisations/state';
import {
  PipelinesEffects,
  pipelinesReducer,
} from '@app/client/pipelines/state';

import { tagsEffects, tagsFeature } from '@app/client/tags/state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

export const organisationProviders: Array<Provider | EnvironmentProviders> = [
  importProvidersFrom(
    StoreModule.forFeature(OrganisationsFeature),
    EffectsModule.forFeature([OrganisationsEffects]),
    StoreModule.forFeature('opportunities', opportunitiesReducer),
    EffectsModule.forFeature([OpportunitiesEffects]),
    StoreModule.forFeature('pipelines', pipelinesReducer),
    EffectsModule.forFeature([PipelinesEffects]),
    StoreModule.forFeature(tagsFeature),
    EffectsModule.forFeature([tagsEffects]),
  ),
];

export const ORGANISATION_ROUTES: Routes = [
  {
    path: '',
    providers: [organisationProviders],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@app/client/organisations/feature/organisations-table').then(
            (m) => m.OrganisationsTableComponent,
          ),
      },
    ],
  },
];
