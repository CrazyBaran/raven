import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NotesEffects, notesReducer } from '@app/rvnc-notes';
import {
  OPPORTUNITIES_ROUTES,
  OpportunitiesEffects,
  opportunitiesReducer,
} from '@app/rvnc-opportunities';
import { PipelinesEffects, pipelinesReducer } from '@app/rvnc-pipelines';
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
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then(
            (c) => c.HomePageComponent,
          ),
        pathMatch: 'full',
      },
      {
        path: 'companies',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/companies-page/companies-page.component').then(
                (c) => c.CompaniesPageComponent,
              ),
          },
          {
            path: 'pipeline',
            providers: [
              importProvidersFrom(
                StoreModule.forFeature('opportunities', opportunitiesReducer),
                EffectsModule.forFeature([OpportunitiesEffects]),
                StoreModule.forFeature('pipelines', pipelinesReducer),
                EffectsModule.forFeature([PipelinesEffects]),
              ),
            ],
            loadComponent: () =>
              import('./pages/pipelines-page/pipelines-page.component').then(
                (c) => c.PipelinesPageComponent,
              ),
          },
          {
            path: 'opportunities',
            providers: [
              importProvidersFrom(
                StoreModule.forFeature('opportunities', opportunitiesReducer),
                EffectsModule.forFeature([OpportunitiesEffects]),
              ),
            ],
            children: OPPORTUNITIES_ROUTES,
          },
        ],
      },
      {
        path: 'notes',
        providers: [
          importProvidersFrom(
            StoreModule.forFeature('notes', notesReducer),
            EffectsModule.forFeature([NotesEffects]),
          ),
        ],
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
