import { Routes } from '@angular/router';
import { provideFileFeature } from '@app/client/files/feature/state';
import { provideNotesFeature } from '@app/client/notes/state';
import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideOrganisationFeature } from '@app/client/organisations/state';
import { providePipelinesFeature } from '@app/client/pipelines/state';
import { provideRemindersFeature } from '@app/client/reminders/state';
import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';

export const ORGANISATION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNotesFeature(),
      provideTemplatesFeature(),
      provideFileFeature(),
      provideOrganisationFeature(),
      provideOpportunitiesFeature(),
      providePipelinesFeature(),
      provideTagsFeature(),
      provideRemindersFeature(),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            '@app/client/organisations/feature/organisations-table-v2'
          ).then((m) => m.OrganisationsTableV2Component),
        providers: [provideShortlistsFeature()],
      },
      {
        path: 'pipeline',
        loadChildren: () =>
          import('@app/client/pipelines/feature/shell').then(
            (c) => c.PIPELINES_ROUTES,
          ),
      },
      {
        path: ':organisationId',
        loadComponent: () =>
          import('@app/client/organisations/feature/organisation-page').then(
            (m) => m.OrganisationPageComponent,
          ),
      },
    ],
  },
];
