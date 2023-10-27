import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { ComponentData } from '@app/client/shared/dynamic-renderer/data-access';

import { TemplatesStoreFacade } from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { WindowRef } from '@progress/kendo-angular-dialog';

import { NotesActions } from '@app/client/notes/data-access';
import {
  NotepadForm,
  NotepadFormComponent,
  TITLE_FIELD,
} from '@app/client/notes/ui';
import { ImagePathDictionaryService } from '@app/client/shared/storage/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-notepad-content',
  standalone: true,
  imports: [
    CommonModule,
    NotepadFormComponent,
    ReactiveFormsModule,
    ButtonsModule,
    LoaderModule,
  ],
  templateUrl: './notepad-content.component.html',
  styleUrls: ['./notepad-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NotepadContentComponent {
  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected noteFacade = inject(NoteStoreFacade);
  protected actions$ = inject(Actions);
  protected windowRef = inject(WindowRef);
  protected imagePathDictionaryService = inject(ImagePathDictionaryService);

  //TODO: MOVE TO COMPONENT STORE
  protected defaultTemplate = this.templateFacade.defaultTemplate;
  protected isCreatePending = this.noteFacade.isCreatingNote;

  protected fb = inject(FormBuilder);
  protected notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
  });

  public submit(): void {
    const imageDictionary =
      this.imagePathDictionaryService.getImageDictionary();
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== TITLE_FIELD.id)
      .map(([id, value]) => {
        const clearedValue = Object.entries(imageDictionary).reduce(
          (acc, [fileName, sasUrl]) => {
            return acc
              .replace(new RegExp('&amp;', 'g'), '&')
              .replace(sasUrl, fileName);
          },
          value ?? '',
        );
        return { id, value: clearedValue || '' };
      });

    const { template, notes, tags, peopleTags, rootVersionId } =
      this.notepadForm.value!;
    const payload = {
      name: notes['TITLE'] || '',
      templateId: template?.id || this.defaultTemplate().id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? []).map((t) => t.replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
      rootVersionId,
    };

    this.noteFacade.createNote(payload);

    this.actions$
      .pipe(
        ofType(NotesActions.createNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe(() => this.close());
  }

  public close(): void {
    this.windowRef?.close();
  }
}

export const componentDataResolver = (data: ComponentData): unknown => {
  return {};
};
