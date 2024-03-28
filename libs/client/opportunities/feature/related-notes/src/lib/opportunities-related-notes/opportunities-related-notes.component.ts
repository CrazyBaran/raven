//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';

import { trigger } from '@angular/animations';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesActions } from '@app/client/opportunities/api-notes';
import { selectNoteFields } from '@app/client/opportunities/data-access';
import {
  NoteFieldComponent,
  NoteFieldSkeletonComponent,
  NoteHeatmapFieldComponent,
  StatusIndicatorState,
} from '@app/client/opportunities/ui';
import {
  RichTextComponent,
  getSchemaWithCrossorigin,
  imageUploader,
} from '@app/client/shared/dynamic-form-util';
import { UploadFileService } from '@app/client/shared/storage/data-access';
import { LoaderComponent, delayedFadeIn, fadeIn } from '@app/client/shared/ui';
import { RecreateViewDirective } from '@app/client/shared/ui-directives';
import { selectQueryParam } from '@app/client/shared/util-router';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TemplateActions } from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EditorView } from '@progress/kendo-angular-editor';
import * as _ from 'lodash';
import { firstValueFrom, map } from 'rxjs';
import { RelatedNotesContainerComponent } from '../related-notes-container/related-notes-container.component';
import {
  selectOpportunitiesRelatedNotesViewModel,
  selectOpportunityFormRecord,
  selectRelatedNotesWithFields,
} from './opportunities-related-notes.selectors';

@Component({
  selector: 'app-opportunities-related-notes',
  standalone: true,
  imports: [
    NoteFieldSkeletonComponent,
    ReactiveFormsModule,
    NoteFieldComponent,
    RelatedNotesContainerComponent,
    NgClass,
    NoteHeatmapFieldComponent,
    JsonPipe,
    LoaderComponent,
    RecreateViewDirective,
  ],
  templateUrl: './opportunities-related-notes.component.html',
  styleUrls: ['./opportunities-related-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', fadeIn()),
    trigger('delayedFadeIn', delayedFadeIn()),
  ],
})
export class OpportunitiesRelatedNotesComponent {
  @ViewChildren(RichTextComponent)
  public richTextEditors: QueryList<RichTextComponent>;

  protected router = inject(Router);
  protected activeRoute = inject(ActivatedRoute);
  protected store = inject(Store);

  protected actions = inject(Actions);

  protected uploadFileService = inject(UploadFileService);

  protected formGroup = new FormRecord({});

  protected allFields = this.store.select(selectNoteFields);

  protected state = signal(
    {
      disabledForm: false,
      updatingField: null as null | string,
      state: 'none' as StatusIndicatorState,
    },
    {
      equal: _.isEqual,
    },
  );

  protected vm = this.store.selectSignal(
    selectOpportunitiesRelatedNotesViewModel,
  );

  protected proseMirrorSettings = {
    schema: getSchemaWithCrossorigin(),
    plugins: [
      imageUploader({
        upload: async (fileOrUrl: File | string, view: EditorView) => {
          return await firstValueFrom(
            this.uploadFileService
              .uploadFile(
                fileOrUrl as File,
                this.vm().opportunityNote.rootVersionId,
              )
              .pipe(map((res) => res.data!.sasToken)),
          );
        },
      }),
    ],
  };

  protected fields$ = this.store
    .select(selectOpportunitiesRelatedNotesViewModel)
    .pipe(
      map(({ visibleFields }) => visibleFields),
      distinctUntilChangedDeep(),
    );

  protected fields = toSignal(this.fields$);

  protected fieldIds = computed(
    () => this.fields()?.map((x) => x.formControlName),
    {
      equal: _.isEqual,
    },
  );

  public constructor() {
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
    this.store
      .select(selectOpportunityFormRecord)
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((values) => {
        Object.entries(values).forEach(([key, value]) => {
          if (this.formGroup.controls[key]) {
            this.formGroup.controls[key].setValue(value, { emitEvent: false });
          } else {
            this.formGroup.addControl(
              key,
              new FormControl(value, { updateOn: 'blur' }),
              { emitEvent: false },
            );
          }

          //remove controls that are not in the form
          Object.keys(this.formGroup.controls).forEach((key) => {
            if (!(key in values)) {
              this.formGroup.removeControl(key, { emitEvent: false });
            }
          });
        });
      });

    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((change) => {
        this.updateNotes();
      });

    this.actions
      .pipe(takeUntilDestroyed(), ofType(NotesActions.updateNoteSuccess))
      .subscribe(() => {
        this.state.update((state) => ({
          ...state,
          state: 'updated',
        }));
      });

    this.actions
      .pipe(takeUntilDestroyed(), ofType(NotesActions.updateNoteFailure))
      .subscribe(() => {
        this.state.update((state) => ({
          ...state,
          state: 'failed',
        }));
      });

    this.store
      .select(selectRelatedNotesWithFields)
      .pipe(
        takeUntilDestroyed(),
        map((notes) => notes.map((note) => note.id)),
        distinctUntilChangedDeep(),
      )
      .subscribe((noteIds) => {
        noteIds.forEach((id) => {
          this.store.dispatch(NotesActions.getNoteAttachments({ id }));
        });
      });

    this.store
      .select(selectQueryParam('tab'))
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((tab) => {
        this.state.update((state) => ({
          ...state,
          updatingField: null,
        }));
      });

    this.actions
      .pipe(takeUntilDestroyed(), ofType(NotesActions.liveCreateNote))
      .subscribe(() => {
        this.store.dispatch(
          NotesActions.getOpportunityNotes({
            opportunityId: this.vm().opportunityId!,
            silently: true,
          }),
        );
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  public showAlertMessageWhenClosingTab($event: any): void {
    if (this.richTextEditors?.some((editor) => editor.active()!)) {
      $event.returnValue = 'Changes that you made may not be saved.';
    }
  }

  public onValueChange(formControlName: string): void {
    this.state.update((state) => ({
      ...state,
      updatingField: formControlName,
      state: 'none',
    }));
  }

  protected getState(field: string): StatusIndicatorState {
    return this.state().updatingField === field ? this.state().state : 'none';
  }

  protected onHeatmapEdit(): void {
    this.router.navigate([], {
      queryParams: { 'edit-financial-kpi': 'true' },
      queryParamsHandling: 'merge',
      relativeTo: this.activeRoute,
    });
  }

  private updateNotes(): void {
    const noteId = this.vm().opportunityNoteId;
    this.state.update((state) => ({
      ...state,
      state: 'validate',
    }));
    this.store.dispatch(
      NotesActions.updateNote({
        noteId: noteId,
        data: {
          name: this.vm().opportunityNote.name,
          fields: _.chain(this.formGroup.value as Record<string, unknown>)
            .map((value, id) => ({
              id: this.vm().allFields.find((x) => x.uniqId === id)!.id,
              value: value ?? '',
            }))
            .value(),
          tagIds: this.vm().opportunityNote.tags.map((x: any) => x.id),
          origin: this.vm().opportunityNote,
          companyOpportunityTags: [],
          opportunityId: this.vm().opportunityId,
        },
      }),
    );
  }
}
