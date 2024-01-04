import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NoteStoreFacade } from './lib/+state/notes-fasade.service';
import { NotesEffects } from './lib/+state/notes.effects';
import { notesFeature } from './lib/+state/notes.reducer';

export * from './lib/+state/notes-fasade.service';
export * from './lib/+state/notes.actions';
export * from './lib/+state/notes.selectors';
export * from './lib/domain/get-notes.params';
export * from './lib/services/notes.service';

export const provideNotesFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  NoteStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(notesFeature),
    EffectsModule.forFeature([NotesEffects]),
  ),
];
