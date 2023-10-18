import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { Routes } from '@angular/router';
import {
  NotesEffects,
  notesFeatureKey,
  notesReducer,
  NotesService,
  NoteStoreFacadeService,
} from '@app/rvnc-notes/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const notesProviders: Array<Provider | EnvironmentProviders> = [
  NotesService,
  NoteStoreFacadeService,
  importProvidersFrom(
    StoreModule.forFeature(notesFeatureKey, notesReducer),
    EffectsModule.forFeature([NotesEffects]),
  ),
];

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    providers: [notesProviders],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/rvnc-notes/feature/notepad').then(
            (m) => m.RvncNotesFeatureNotepadComponent,
          ),
      },
    ],
  },
];
