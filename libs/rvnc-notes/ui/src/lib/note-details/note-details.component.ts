import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { LoaderComponent } from '@app/rvnc-core-ui';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import {
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { NotesActions } from '../../../../data-access/src/lib/+state/notes.actions';
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
    WindowModule,
    LoaderComponent,
    ExpansionPanelModule,
    ButtonsModule,
    NotepadFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailsComponent implements OnInit, OnDestroy {
  @Input() public noteId: string | null;
  @Output() public closeWindow = new EventEmitter();

  public notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
    title: '',
  });

  public readonly mockedTags: { name: string; color: string }[] = [
    {
      name: 'Company tag',
      color: 'text-error',
    },
    {
      name: 'Industry tag',
      color: 'text-grey-500',
    },
    {
      name: 'Investor tag',
      color: 'text-warning',
    },
    {
      name: 'Business model tag',
      color: 'text-primary-500',
    },
  ];

  public noteDetails: NoteWithRelationsData | null = null;
  public noteFields: NoteFieldData[] = [];
  public editMode = false;
  public readonly noteDetails$ = this.noteStoreFacade.noteDetails$;
  public readonly isLoading$ = this.noteStoreFacade.isLoadingNoteDetails$;
  public readonly isUpdating = this.noteStoreFacade.isUpdatingNote;

  private ngUnsubscribe = new Subject<void>();
  public constructor(
    private readonly noteStoreFacade: NoteStoreFacade,
    private actions$: Actions,
    private router: Router,
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
        });
        this.prepareAllNotes(noteDetails?.noteFieldGroups || []);
      });
  }

  public handleCloseWindow(): void {
    this.closeWindow.emit();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  public updateNote(): void {
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== 'TITLE')
      .map(([id, value]) => ({ id, value: value || '' }));

    const { template, notes, tags, peopleTags } = this.notepadForm.value!;
    const payload = {
      name: notes[TITLE_FIELD.id] || '',
      templateId: template?.id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? []).map((t) => t.replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
    };

    this.noteStoreFacade.updateNote(this.noteDetails!.id, payload);

    this.actions$
      .pipe(
        ofType(NotesActions.updateNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe((action) => {
        this.editMode = false;
        this.router.navigate(['notes'], {
          queryParams: { noteId: action.data.id },
        });
      });
  }

  private prepareAllNotes(notes: NoteFieldGroupsWithFieldData[]): void {
    this.noteFields = notes.reduce((res, curr) => {
      if (curr.noteFields.length) {
        return [...res, ...curr.noteFields];
      }
      return res;
    }, [] as NoteFieldData[]);
  }
}
