import { Route } from '@angular/router';

export const SHORTLIST_ROUTES: Route[] = [
  {
    path: '',
    providers: [],
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
