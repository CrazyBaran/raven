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
  NoteStoreFacade,
} from '@app/rvnc-notes/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const notesProviders: Array<Provider | EnvironmentProviders> = [
  NotesService,
  NoteStoreFacade,
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
        pathMatch: 'full',
        loadComponent: () =>
          import('@app/rvnc-notes/feature/notes-list').then(
            (m) => m.RvncNotesFeatureNotesListComponent,
          ),
      },
    ],
  },
];
