/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor notes table

import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NoteStoreFacade, NotesActions } from '@app/client/notes/data-access';
import { TagFilterPipe } from '@app/client/notes/util';
import { SafeHtmlPipe } from '@app/client/shared/pipes';
import { ImagePathDictionaryService } from '@app/client/shared/storage/data-access';
import { LoaderComponent, TagComponent } from '@app/client/shared/ui';
import {
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {
  DialogResult,
  DialogService,
  WindowComponent,
  WindowModule,
} from '@progress/kendo-angular-dialog';
import { IconModule } from '@progress/kendo-angular-icons';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { xIcon } from '@progress/kendo-svg-icons';
import { sortBy } from 'lodash';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';
import {
  NotepadForm,
  NotepadFormComponent,
  TITLE_FIELD,
} from '../notepad-form/notepad-form.component';
@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlPipe,
    WindowModule,
    LoaderComponent,
    ExpansionPanelModule,
    ButtonsModule,
    NotepadFormComponent,
    ReactiveFormsModule,
    TagFilterPipe,
    TagComponent,
    IconModule,
  ],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NoteDetailsComponent implements OnInit, OnDestroy {
  @Input() public noteId: string | null;
  @Output() public closeWindow = new EventEmitter();

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  @ViewChild(NotepadFormComponent)
  public notepadFormComponent: NotepadFormComponent;

  @ViewChild(WindowComponent)
  public kendoWindowComponent: WindowComponent;

  public notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
    title: '',
  });

  public noteDetails: NoteWithRelationsData | null = null;
  public noteFields: NoteFieldData[] = [];
  public editMode = false;
  public fields: { id: string; name: string }[] = [];
  public icon = xIcon;
  public readonly noteDetails$ = this.noteStoreFacade.noteDetails$;
  public readonly isLoading$ = this.noteStoreFacade.isLoadingNoteDetails$;
  public readonly isUpdating = this.noteStoreFacade.isUpdatingNote;

  private ngUnsubscribe = new Subject<void>();
  public constructor(
    private readonly noteStoreFacade: NoteStoreFacade,
    private actions$: Actions,
    private router: Router,
    private imagePathDictionaryService: ImagePathDictionaryService,
    private readonly clipBoard: Clipboard,
    private readonly dialogService: DialogService,
  ) {}

  public ngOnInit(): void {
    if (this.noteId) {
      this.noteStoreFacade.getNoteDetails(this.noteId);
    }

    this.noteDetails$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((details) => !!details),
      )
      .subscribe((noteDetails) => {
        this.noteDetails = noteDetails;

        this.notepadForm.setValue({
          template: {
            ...noteDetails,
            fieldGroups: noteDetails?.noteFieldGroups.map((group) => ({
              ...group,
              fieldDefinitions: group.noteFields,
            })),
            name: noteDetails?.templateName,
          } as unknown as TemplateWithRelationsData,
          notes: {},
          peopleTags:
            noteDetails?.tags
              ?.filter((tag) => tag.type === 'people')
              .map((tag) => tag.id) || [],
          tags:
            noteDetails?.tags
              ?.filter((tag) => tag.type !== 'people')
              .map((tag) => tag.id) || [],
          title: noteDetails?.name,
          rootVersionId: noteDetails?.rootVersionId,
        });
        this.prepareAllNotes(noteDetails?.noteFieldGroups || []);
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  public updateNote(): void {
    const payload = this.getPayload();

    this.noteStoreFacade.updateNote(this.noteDetails!.id, payload);

    this.actions$
      .pipe(
        ofType(NotesActions.updateNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe((action) => {
        this.editMode = false;
        this.closeWindow.emit();
      });
  }

  public handleCopyLink(): void {
    this.clipBoard.copy(window.location.href);
  }

  public handleScrollToField(fieldId: string): void {
    document.getElementById(fieldId)?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  public handleDeleteNote(noteId: string): void {
    const dialogRef = this.dialogService.open({
      width: 350,
      content: DeleteNoteComponent,
      appendTo: this.containerRef,
    });

    dialogRef.result.subscribe((result) => {
      if ('submit' in result) {
        this.noteStoreFacade.deleteNote(noteId);
        this.closeWindow.emit();
      }
    });
  }

  public hasChanged(): boolean {
    return this.notepadFormComponent?.notepadForm?.dirty;
  }

  public closeEdit(): void {
    if (this.hasChanged()) {
      this._showUnsavedChangesWarning(() => {
        this.editMode = false;
      });
    } else {
      this.editMode = false;
    }
  }

  public onClose($event: Event): void {
    if (this.editMode && this.hasChanged()) {
      $event.preventDefault();
      this._showUnsavedChangesWarning(() => {
        this.closeWindow.emit();
      });
    } else {
      this.closeWindow.emit();
    }
  }

  public handleCloseWindow(): void {
    this.closeWindow.emit();
  }

  private prepareAllNotes(notes: NoteFieldGroupsWithFieldData[]): void {
    const noteFields = notes.reduce((res, curr) => {
      if (curr.noteFields.length) {
        return [...res, ...curr.noteFields];
      }
      return res;
    }, [] as NoteFieldData[]);

    const sortedFields = sortBy(noteFields, 'order').filter((note) =>
      note.value.trim(),
    );

    this.noteFields = sortedFields;
    this.fields = sortedFields.map((field) => ({
      name: field.name,
      id: field.id,
    }));
  }

  private getPayload(): {
    name: string;
    templateId: string | undefined;
    fields: { id: string; value: string }[];
    tagIds: string[];
  } {
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== TITLE_FIELD.id)
      .map(([id, value]) => {
        const clearedValue = Object.entries(
          this.imagePathDictionaryService.getImageDictionary(),
        ).reduce((acc, [fileName, sasUrl]) => {
          return acc
            .replace(new RegExp('&amp;', 'g'), '&')
            .replace(sasUrl, fileName);
        }, value ?? '');
        return { id, value: clearedValue || '' };
      });

    const { template, notes, tags, peopleTags } = this.notepadForm.value!;
    return {
      name: notes[TITLE_FIELD.id] || '',
      templateId: template?.id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? []).map((t) => t.replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
    };
  }

  private _showUnsavedChangesWarning(callbackFn: () => void): void {
    this.dialogService
      .open({
        appendTo: this.containerRef,
        title: 'Leave without publishing?',
        width: 350,
        content:
          'Any progress will be lost without publishing first. Are you sure you want to continue?',
        actions: [
          { text: 'No' },
          {
            text: 'Yes, leave without publishing',
            primary: true,
            themeColor: 'primary',
          },
        ],
      })
      .result.subscribe((res: DialogResult) => {
        if ('text' in res && res.text === 'Yes, leave without publishing') {
          callbackFn?.();
        }
      });
  }
}
