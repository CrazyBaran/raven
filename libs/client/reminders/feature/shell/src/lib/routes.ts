import { Route } from '@angular/router';
import { provideRemindersFeature } from '@app/client/reminders/state';
import { provideTagsFeature } from '@app/client/tags/state';

export const REMINDERS_ROUTES: Route[] = [
  {
    path: '',
    providers: [provideRemindersFeature(), provideTagsFeature()],
    children: [
      {
        path: '',
        providers: [],
        loadComponent: () =>
          import('@app/client/reminders/feature/table').then(
            (m) => m.RemindersTableContainerComponent,
          ),
      },
    ],
  },
];
