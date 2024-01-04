import { EnvironmentProviders, inject, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { FileTypeBadgeColorsResolver } from '@app/client/files/ui';
import { notesQuery, provideNotesFeature } from '@app/client/notes/state';
import { NOTE_TYPE_BADGE_COLORS } from '@app/client/notes/ui';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const notesProviders: Array<Provider | EnvironmentProviders> = [
  provideNotesFeature(),
  provideTagsFeature(),
  provideTemplatesFeature(),
  {
    provide: NOTE_TYPE_BADGE_COLORS,
    useFactory: (): FileTypeBadgeColorsResolver => {
      const store = inject(Store);

      return {
        resolve: (fileType: string) =>
          store.select(notesQuery.selectNotesTypeBadgeColors).pipe(
            map(
              (dictionary) =>
                dictionary[fileType] ?? {
                  backgroundColor: '#e0e0e0',
                  color: '#000000',
                },
            ),
          ),
      };
    },
  },
];

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    providers: [notesProviders],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@app/client/notes/feaure/list').then(
            (m) => m.NotesListComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('@app/client/notes/feaure/notepad').then(
            (m) => m.NotepadContentComponent,
          ),
      },
    ],
  },
];
