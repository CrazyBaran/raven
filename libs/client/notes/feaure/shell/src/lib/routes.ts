import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  Provider,
} from '@angular/core';
import { Routes } from '@angular/router';
import { provideWebsocketEffects } from '@app/client/core/websockets';
import { FileTypeBadgeColorsResolver } from '@app/client/files/ui';
import {
  NotesEffects,
  notesFeature,
  notesQuery,
  NoteStoreFacade,
} from '@app/client/notes/data-access';
import { NOTE_TYPE_BADGE_COLORS } from '@app/client/notes/ui';
import {
  tagsEffects,
  tagsFeature,
  TagsStoreFacade,
} from '@app/client/tags/state';
import { templateFeatureProviders } from '@app/client/templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { map } from 'rxjs';

export const notesProviders: Array<Provider | EnvironmentProviders> = [
  NoteStoreFacade,
  TagsStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(notesFeature),
    EffectsModule.forFeature([NotesEffects]),
    StoreModule.forFeature(tagsFeature),
    EffectsModule.forFeature(tagsEffects),
  ),
  templateFeatureProviders,
  provideWebsocketEffects(),
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
  // provideNoteTypeBadgeColors(() => {
  //   return inject(Store).select(notesQuery.selectNotesTypeBadgeColors);
  // }),
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
            (m) => m.RvncNotesFeatureNotesListComponent,
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
