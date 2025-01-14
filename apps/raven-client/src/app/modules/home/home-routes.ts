/* eslint-disable @nx/enforce-module-boundaries */
import { Routes } from '@angular/router';

import { provideWebsocketEffects } from '@app/client/core/websockets';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideRemindersFeature } from '@app/client/reminders/state';
import { HomeComponent } from './home.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    providers: [
      provideRemindersFeature(),
      providePipelinesFeature(),
      provideWebsocketEffects(),
    ],
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
            path: 'shortlists',
            loadChildren: () =>
              import('@app/client/shortlists/feature/shell').then(
                (m) => m.SHORTLIST_ROUTES,
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('@app/client/organisations/feature/shell').then(
                (c) => c.ORGANISATION_ROUTES,
              ),
          },

          {
            path: ':organisationId/opportunities',
            loadChildren: () =>
              import('@app/client/opportunities/feature/shell').then(
                (m) => m.OPPORTUNITIES_ROUTES,
              ),
          },
        ],
      },
      {
        path: 'notes',
        loadChildren: () =>
          import('@app/client/notes/feature/shell').then((m) => m.NOTES_ROUTES),
      },
      {
        path: 'reminders',
        loadChildren: () =>
          import('@app/client/reminders/feature/shell').then(
            (m) => m.REMINDERS_ROUTES,
          ),
      },
      {
        path: 'managers',
        loadChildren: () =>
          import('@app/client/managers/feature/shell').then(
            (m) => m.MANAGERS_ROUTES,
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
