import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import {
  OrganisationsEffects,
  OrganisationsFeature,
} from '@app/client/organisations/state';

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
        providers: [
          importProvidersFrom(
            StoreModule.forFeature(OrganisationsFeature),
            EffectsModule.forFeature([OrganisationsEffects]),
          ),
        ],
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
            loadChildren: () =>
              import('@app/client/pipelines/feature/shell').then(
                (c) => c.PIPELINES_ROUTES,
              ),
          },
          {
            path: ':companyId',
            children: [
              {
                path: 'opportunities',
                loadChildren: () =>
                  import('@app/client/opportunities/feature/shell').then(
                    (m) => m.OPPORTUNITIES_ROUTES,
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'notes',
        loadChildren: () =>
          import('@app/client/notes/feaure/shell').then((m) => m.NOTES_ROUTES),
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
