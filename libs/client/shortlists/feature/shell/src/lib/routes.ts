import { Route } from '@angular/router';
import { provideTagsFeature } from '@app/client/tags/state';

export const SHORTLIST_ROUTES: Route[] = [
  {
    path: '',
    providers: [provideTagsFeature()],
    children: [
      {
        path: '',
        providers: [],
        loadComponent: () =>
          import('@app/client/shortlists/feature/table').then(
            (m) => m.ShortlistTableContainerComponent,
          ),
      },
    ],
  },
];
