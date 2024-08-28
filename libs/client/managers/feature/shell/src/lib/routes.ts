import { Route } from '@angular/router';
import { provideManagersFeature } from '@app/client/managers/state';
import { provideTagsFeature } from '@app/client/tags/state';

export const MANAGERS_ROUTES: Route[] = [
  {
    path: '',
    providers: [provideManagersFeature(), provideTagsFeature()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/client/managers/feature/table').then(
            (m) => m.ManagersTableContainerComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@app/client/managers/feature/details').then(
            (m) => m.ManagerDetailsComponent,
          ),
      },
    ],
  },
];
