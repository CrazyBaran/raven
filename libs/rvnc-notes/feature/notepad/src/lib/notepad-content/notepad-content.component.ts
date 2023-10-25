import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentData } from '@app/rvnc-dynamic-renderer/data-access';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';

import { TemplatesStoreFacade } from '@app/rvnc-templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { WindowRef } from '@progress/kendo-angular-dialog';

import { NotepadForm, NotepadFormComponent } from '@app/rvnc-notes/ui';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { filter, take } from 'rxjs';
import { NotesActions } from '../../../../../data-access/src/lib/+state/notes.actions';

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
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== 'TITLE')
      .map(([id, value]) => ({ id, value: value || '' }));

    const { template, notes, tags, peopleTags } = this.notepadForm.value!;
    const payload = {
      name: notes['TITLE'] || '',
      templateId: template?.id || this.defaultTemplate().id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? []).map((t) => t.replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
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
