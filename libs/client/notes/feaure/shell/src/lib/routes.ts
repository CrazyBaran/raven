import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { Routes } from '@angular/router';
import {
  NotesEffects,
  notesFeature,
  NoteStoreFacade,
} from '@app/client/notes/data-access';
import {
  tagsEffects,
  tagsFeature,
  TagsStoreFacade,
} from '@app/client/tags/state';
import { templateFeatureProviders } from '@app/client/templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

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
    ],
  },
];
