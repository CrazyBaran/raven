import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { Route } from '@angular/router';
import { provideFileFeature } from '@app/client/files/feature/state';
import { notesProviders } from '@app/client/notes/feaure/shell';
import {
  OpportunitiesEffects,
  OpportunitiesFacade,
  opportunitiesFeature,
} from '@app/client/opportunities/data-access';
import {
  OrganisationsEffects,
  OrganisationsFeature,
} from '@app/client/organisations/state';
import {
  PipelinesEffects,
  pipelinesReducer,
} from '@app/client/pipelines/state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const opportunitiesProviders: Array<Provider | EnvironmentProviders> = [
  OpportunitiesFacade,
  importProvidersFrom(
    StoreModule.forFeature(opportunitiesFeature),
    EffectsModule.forFeature([OpportunitiesEffects]),
    StoreModule.forFeature(OrganisationsFeature),
    EffectsModule.forFeature([OrganisationsEffects]),
    StoreModule.forFeature('pipelines', pipelinesReducer),
    EffectsModule.forFeature([PipelinesEffects]),
  ),
];

export const OPPORTUNITIES_ROUTES: Route[] = [
  {
    path: '',
    providers: [opportunitiesProviders],
    children: [
      {
        path: ':opportunityId',
        providers: [notesProviders],
        loadComponent: () =>
          import('@app/client/opportunities/page/opportunity-details').then(
            (m) => m.OpportunityDetailsPageComponent,
          ),
        children: [
          {
            path: 'overview',
            redirectTo: '',
            pathMatch: 'full',
          },
          {
            path: '',
            loadComponent: () =>
              import('@app/client/opportunities/feature/overview').then(
                (m) => m.ClientOpportunitiesFeatureOverviewComponent,
              ),
          },
          {
            path: 'files',
            providers: [provideFileFeature],
            loadComponent: () =>
              import('@app/client/opportunities/feature/files').then(
                (m) => m.OpportunityFilesComponent,
              ),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('@app/client/files/feature/files-table').then(
                    (m) => m.FilesTableComponent,
                  ),
              },
            ],
          },
          {
            path: 'notes',
            loadComponent: () =>
              import(
                '@app/client/opportunities/feature/opportunity-notes'
              ).then((m) => m.OpportunityNotesComponent),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('@app/client/notes/feature/notes-table').then(
                    (m) => m.NotesTableContainerComponent,
                  ),
              },
            ],
          },
          {
            path: 'related-notes',
            loadComponent: () =>
              import('@app/client/opportunities/feature/related-notes').then(
                (m) => m.OpportunitiesRelatedNotesComponent,
              ),
          },
        ],
      },
    ],
  },
];
