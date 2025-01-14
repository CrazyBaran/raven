import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteStoreFacade, NotesActions } from '@app/client/notes/state';
import {
  DeleteNoteComponent,
  NoteDetailsComponent,
  NotepadForm,
  NotepadFormComponent,
  TITLE_FIELD,
} from '@app/client/notes/ui';
import { ShelfTemplateBase } from '@app/client/shared/dynamic-renderer/feature';
import {
  ClipboardDirective,
  LoaderComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { ControlInvalidPipe, ToUrlPipe } from '@app/client/shared/ui-pipes';
import { controlDragArea } from '@app/client/shared/util';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogResult,
  DialogService,
  DialogsModule,
  WindowMaximizeActionDirective,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { exportIcon, xIcon } from '@progress/kendo-svg-icons';
import { RxPush } from '@rx-angular/template/push';
import { filter, take } from 'rxjs';
import { selectQueryParam } from '../../../../../../shared/util-router/src';
import { TemplateActions } from '../../../../../../templates/data-access/src';
import {
  selectNoteDetailsDialogViewModel,
  selectNoteDetailsForm,
} from './note-details-dialog.selectors';

@Component({
  selector: 'app-note-details-dialog',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    NotepadFormComponent,
    ReactiveFormsModule,
    ButtonModule,
    DialogsModule,
    TagComponent,
    ExpansionPanelModule,
    ClipboardDirective,
    ToUrlPipe,
    DatePipe,
    UserTagDirective,
    TooltipModule,
    RxPush,
    NoteDetailsComponent,
    ControlInvalidPipe,
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

  @ViewChild('maximizeButton', { read: WindowMaximizeActionDirective })
  public maximizeButton: WindowMaximizeActionDirective;

  @ViewChild('windowTitleBarRef', { static: true })
  public windowTitleBarRef: TemplateRef<unknown>;

  public notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
    title: '',
  });

  public vm = this.store.selectSignal(selectNoteDetailsDialogViewModel);

  public noteDetails = computed(() => this.vm().noteDetails!);

  public editMode = false;

  public fields: { id: string; name: string }[] = [];

  public icon = xIcon;
  public newTabIcon = exportIcon;

  public readonly isUpdating = this.noteStoreFacade.isUpdatingNote;

  public destroyRef = inject(DestroyRef);

  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);

  protected windowRef = inject(WindowRef);

  protected tryGoInEditMode = false;

  protected maximizedOnInit = false;
  protected maximizeOnInit = false;
  public constructor(
    private store: Store,
    private readonly noteStoreFacade: NoteStoreFacade,
    private actions$: Actions,
    private readonly dialogService: DialogService,
  ) {
    super();
    this.store.dispatch(NotesActions.getCurrentNoteDetails());
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  public closeWindow(): void {
    this.windowRef.close();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'note-details': null,
        'note-edit': null,
        fullscreen: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  public ngOnInit(): void {
    controlDragArea(this.windowRef);

    this.store
      .select(selectNoteDetailsForm)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((form) => !!form),
        distinctUntilChangedDeep(),
      )
      .subscribe((form) => {
        this.notepadForm.setValue(form);
        if (this.tryGoInEditMode) {
          this.editMode = this.vm()?.canEditNote;
        }
        if (
          this.maximizeButton &&
          this.maximizeOnInit &&
          !this.maximizedOnInit
        ) {
          this.maximizeButton.onClick?.();
          this.maximizedOnInit = true;
        }
      });

    this.store
      .select(selectQueryParam('fullscreen'))
      .subscribe((fullscreen) => {
        this.maximizeOnInit = !!fullscreen;
      });

    this.store
      .select(selectQueryParam('note-edit'))
      .subscribe((enterEditMode) => {
        this.tryGoInEditMode = !!enterEditMode;
      });
  }

  public updateNote(stayInEditMode = false): void {
    const payload = this.getPayload();
    this.store.dispatch(
      NotesActions.updateNote({
        noteId: this.noteDetails()!.id!,
        data: payload,
      }),
    );

    this.actions$
      .pipe(
        ofType(NotesActions.updateNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe((action) => {
        this.editMode = false;
        if (!stayInEditMode) {
          this.closeWindow();
        } else {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              'note-details': action.data.id,
              'note-edit': true,
            },
            queryParamsHandling: 'merge',
          });
          this.windowRef.close();
        }
      });
  }

  public handleDeleteNote(noteId: string | undefined): void {
    if (!noteId) return;

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
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'note-edit': null,
      },
      queryParamsHandling: 'merge',
    });
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

  public onNewTabClick($event: Event): void {
    let newTabLink = `${window.location.toString()}&fullscreen=true`;
    if (this.editMode) {
      newTabLink += '&note-edit=true';
    }
    if (this.editMode && this.hasChanged()) {
      $event.preventDefault();
      this._showUnsavedChangesWarning(() => {
        window.open(
          newTabLink,
          '_blank',
          'resizable=yes, toolbar=no, scrollbars=yes, menubar=no, status=yes, directories=no, location=no, width=1000, height=600, left=0 top=100 ',
        );
        this.closeWindow();
      });
    } else {
      window.open(
        newTabLink,
        '_blank',
        'resizable=yes, toolbar=no, scrollbars=yes, menubar=no, status=yes, directories=no, location=no, width=1000, height=600, left=0 top=100 ',
      );
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
    companyOpportunityTags?: {
      organisationId: string;
      opportunityTagId: string;
    }[];
  } {
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== TITLE_FIELD.id)
      .map(([id, value]) => {
        return { id, value: value ?? '' };
      });

    const { template, notes, tags, peopleTags } = this.notepadForm.value!;
    return {
      name: notes[TITLE_FIELD.id] || '',
      templateId: template?.id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? [])
          .filter((t) => typeof t === 'string')
          .map((t) => String(t).replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
      companyOpportunityTags: (tags ?? []).filter(
        (t) => typeof t !== 'string',
      ) as {
        organisationId: string;
        opportunityTagId: string;
      }[],
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
