import { importProvidersFrom, NgModule } from '@angular/core';
import {
  NotesEffects,
  notesFeature,
  NoteStoreFacade,
} from '@app/client/notes/data-access';
import { DynamicModule } from '@app/client/shared/dynamic-renderer/data-access';

import { templateFeatureProviders } from '@app/client/templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { tagsEffects, tagsFeature } from '@app/client/notes/api-tags';
import {
  componentDataResolver,
  NotepadContentComponent,
} from './notepad-content/notepad-content.component';

export const notepadContentFeatureProviders = [
  NoteStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(notesFeature),
    EffectsModule.forFeature([NotesEffects]),
    StoreModule.forFeature(tagsFeature),
    EffectsModule.forFeature(tagsEffects),
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
