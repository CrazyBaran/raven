import { importProvidersFrom, NgModule } from '@angular/core';
import { DynamicModule } from '@app/rvnc-dynamic-renderer/data-access';
import {
  NotesEffects,
  notesFeatureKey,
  notesReducer,
  NotesService,
  NoteStoreFacade,
} from '@app/rvnc-notes/data-access';
import { templateFeatureProviders } from '@app/rvnc-templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  componentDataResolver,
  NotepadContentComponent,
} from './notepad-content/notepad-content.component';

export const notepadContentFeatureProviders = [
  NotesService,
  NoteStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(notesFeatureKey, notesReducer),
    EffectsModule.forFeature([NotesEffects]),
  ),
  templateFeatureProviders,
];

@NgModule({
  imports: [NotepadContentComponent],
  exports: [NotepadContentComponent],
  providers: [notepadContentFeatureProviders],
})
export class NotepadDialogModule implements DynamicModule {
  public entry = NotepadContentComponent;
  public componentDataResolver = componentDataResolver;
}
