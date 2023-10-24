import { importProvidersFrom, NgModule } from '@angular/core';
import { DynamicModule } from '@app/rvnc-dynamic-renderer/data-access';
import {
  NotesEffects,
  notesFeature,
  NoteStoreFacade,
} from '@app/rvnc-notes/data-access';
import {
  tagsEffects,
  tagsFeature,
  TagsStoreFacade,
} from '@app/rvnc-tags/state';
import { templateFeatureProviders } from '@app/rvnc-templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  componentDataResolver,
  NotepadContentComponent,
} from './notepad-content/notepad-content.component';

export const notepadContentFeatureProviders = [
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

@NgModule({
  imports: [NotepadContentComponent],
  exports: [NotepadContentComponent],
  providers: [notepadContentFeatureProviders],
})
export class NotepadDialogModule implements DynamicModule {
  public entry = NotepadContentComponent;
  public componentDataResolver = componentDataResolver;
}
