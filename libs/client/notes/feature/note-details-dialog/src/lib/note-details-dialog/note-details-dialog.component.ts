import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesActions, NoteStoreFacade } from '@app/client/notes/data-access';
import {
  DeleteNoteComponent,
  NotepadForm,
  NotepadFormComponent,
  TITLE_FIELD,
} from '@app/client/notes/ui';
import { TagFilterPipe } from '@app/client/notes/util';
import { ShelfTemplateBase } from '@app/client/shared/dynamic-renderer/feature';
import { ImagePathDictionaryService } from '@app/client/shared/storage/data-access';
import {
  ClipboardDirective,
  LoaderComponent,
  TagComponent,
} from '@app/client/shared/ui';
import { SafeHtmlPipe, ToUrlPipe } from '@app/client/shared/ui-pipes';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {
  DialogResult,
  DialogService,
  WindowModule,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import { IconModule } from '@progress/kendo-angular-icons';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { xIcon } from '@progress/kendo-svg-icons';
import { filter, map, take } from 'rxjs';
import { selectNoteDetailsDialogViewModel } from './note-details-dialog.selectors';

@Component({
  selector: 'app-note-details-dialog',
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
    ClipboardDirective,
    ToUrlPipe,
  ],
  templateUrl: './note-details-dialog.component.html',
  styleUrls: ['./note-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailsDialogComponent
  extends ShelfTemplateBase
  implements OnInit
{
  @Input() public noteId: string | null;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  @ViewChild(NotepadFormComponent)
  public notepadFormComponent: NotepadFormComponent;

  @ViewChild('windowTitleBarRef', { static: true })
  public windowTitleBarRef: TemplateRef<unknown>;

  public notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
    title: '',
  });

  public vm$ = this.store.select(selectNoteDetailsDialogViewModel);
  public vm = this.store.selectSignal(selectNoteDetailsDialogViewModel);

  public noteDetails = computed(() => this.vm().noteDetails);
  public noteDetails$ = toObservable(this.noteDetails);

  public editMode = false;

  public fields: { id: string; name: string }[] = [];

  public icon = xIcon;

  public readonly isUpdating = this.noteStoreFacade.isUpdatingNote;

  public destroyRef = inject(DestroyRef);

  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);

  protected windowRef = inject(WindowRef);

  public constructor(
    private store: Store,
    private readonly noteStoreFacade: NoteStoreFacade,
    private actions$: Actions,
    private imagePathDictionaryService: ImagePathDictionaryService,
    private readonly dialogService: DialogService,
  ) {
    super();
    this.store.dispatch(NotesActions.getCurrentNoteDetails());
  }

  public closeWindow(): void {
    this.windowRef.close();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'note-details': null,
      },
      queryParamsHandling: 'merge',
    });
  }

  public ngOnInit(): void {
    this.vm$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(({ form }) => form),
        filter((form) => !!form),
        distinctUntilChangedDeep(),
      )
      .subscribe((form) => {
        this.notepadForm.setValue(form);
      });
  }

  public updateNote(): void {
    const payload = this.getPayload();

    this.noteStoreFacade.updateNote(this.noteDetails()!.id, payload);

    this.actions$
      .pipe(
        ofType(NotesActions.updateNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe((action) => {
        this.editMode = false;
        this.closeWindow();
      });
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
        this.closeWindow();
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
        this.closeWindow();
      });
    } else {
      this.closeWindow();
    }
  }

  public handleCloseWindow(): void {
    this.closeWindow();
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