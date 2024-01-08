import { NgModule } from '@angular/core';
import { provideNotesFeature } from '@app/client/notes/state';
import { DynamicModule } from '@app/client/shared/dynamic-renderer/data-access';

import { provideTagsFeature } from '@app/client/notes/api-tags';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import {
  componentDataResolver,
  NotepadContentComponent,
} from './notepad-content/notepad-content.component';

@NgModule({
  imports: [NotepadContentComponent],
  exports: [NotepadContentComponent],
  providers: [
    provideNotesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class NotepadDialogModule implements DynamicModule {
  public entry = NotepadContentComponent;
  public componentDataResolver = componentDataResolver;
}
