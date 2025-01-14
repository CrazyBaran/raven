import { NgModule } from '@angular/core';
import { provideNotesFeature } from '@app/client/notes/state';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideTagsFeature } from '@app/client/notes/api-tags';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { NoteDetailsDialogComponent } from './note-details-dialog/note-details-dialog.component';

@NgModule({
  imports: [NoteDetailsDialogComponent],
  exports: [NoteDetailsDialogComponent],
  providers: [
    provideNotesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class NotepadDialogModule implements DynamicModule {
  public entry = NoteDetailsDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
