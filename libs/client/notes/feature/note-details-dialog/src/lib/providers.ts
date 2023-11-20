import { importProvidersFrom, NgModule } from '@angular/core';
import {
  NotesEffects,
  notesFeature,
  NoteStoreFacade,
} from '@app/client/notes/data-access';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { templateFeatureProviders } from '@app/client/templates/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { tagsEffects, tagsFeature } from '@app/client/notes/api-tags';
import { NoteDetailsDialogComponent } from './note-details-dialog/note-details-dialog.component';

export const noteDetailsDialogProviders = [
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
  imports: [NoteDetailsDialogComponent],
  exports: [NoteDetailsDialogComponent],
  providers: [noteDetailsDialogProviders],
})
export class NotepadDialogModule implements DynamicModule {
  public entry = NoteDetailsDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
