import { Route } from '@angular/router';
import { provideWebsocketEffects } from '@app/client/core/websockets';
import { provideFileFeature } from '@app/client/files/feature/state';
import { notesProviders } from '@app/client/notes/feature/shell';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideOrganisationFeature } from '@app/client/organisations/state';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideRemindersFeature } from '@app/client/reminders/state';

export const OPPORTUNITIES_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideOpportunitiesFeature(),
      provideOrganisationFeature(),
      providePipelinesFeature(),
      provideWebsocketEffects(),
      provideRemindersFeature(),
    ],
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
            providers: [provideFileFeature()],
            loadComponent: () =>
              import('@app/client/files/feature/files-table').then(
                (m) => m.FilesTableComponent,
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
