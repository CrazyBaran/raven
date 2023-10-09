import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import {
  OpportunitiesEffects,
  opportunitiesReducer,
} from '@app/rvnc-opportunities';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HomeComponent } from './home.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'pipelines',
        pathMatch: 'full',
      },
      {
        path: 'pipelines',
        providers: [
          importProvidersFrom(
            StoreModule.forFeature('opportunities', opportunitiesReducer),
            EffectsModule.forFeature([OpportunitiesEffects]),
          ),
        ],
        loadComponent: () =>
          import('./pages/pipelines-page/pipelines-page.component').then(
            (c) => c.PipelinesPageComponent,
          ),
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./pages/notes-page/notes-page.component').then(
            (c) => c.NotesPageComponent,
          ),
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./pages/templates-page/templates-page.component').then(
            (c) => c.TemplatesPageComponent,
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./pages/contacts-page/contacts-page.component').then(
            (c) => c.ContactsPageComponent,
          ),
      },
      {
        path: 'bad-gateway',
        loadComponent: () =>
          import(
            '../../pages/bad-gateway-page/bad-gateway-page.component'
          ).then((c) => c.BadGatewayPageComponent),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import(
            '../../pages/access-denied-page/access-denied-page.component'
          ).then((c) => c.AccessDeniedPageComponent),
      },
    ],
  },
];
