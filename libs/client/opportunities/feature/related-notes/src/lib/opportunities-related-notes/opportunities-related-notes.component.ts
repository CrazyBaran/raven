//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotesActions } from '@app/client/opportunities/api-notes';
import {
  RichTextComponent,
  getSchemaWithCrossorigin,
  imageUploader,
} from '@app/client/shared/dynamic-form-util';
import { UploadFileService } from '@app/client/shared/storage/data-access';
import {
  KendoDynamicPagingDirective,
  LoaderComponent,
  fadeIn,
} from '@app/client/shared/ui';
import { SafeHtmlPipe, TimesPipe } from '@app/client/shared/ui-pipes';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { EditorView } from '@progress/kendo-angular-editor';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  ExpansionPanelModule,
  TileLayoutModule,
} from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';

import { trigger } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NoteTypeBadgeComponent } from '@app/client/notes/ui';
import { RelatedNotesTableComponent } from '@app/client/opportunities/ui';
import { TemplateActions } from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import {
  LoaderModule,
  SkeletonModule,
} from '@progress/kendo-angular-indicators';
import * as _ from 'lodash';
import { firstValueFrom, map } from 'rxjs';
import {
  selectOpportunitiesRelatedNotesViewModel,
  selectOpportunityFormRecord,
} from './opportunities-related-notes.selectors';

@Component({
  selector: 'app-opportunities-related-notes',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    RxFor,
    SafeHtmlPipe,
    ReactiveFormsModule,
    RichTextComponent,
    ButtonModule,
    RouterLink,
    LoaderComponent,
    RxIf,
    ExpansionPanelModule,
    RxLet,
    GridModule,
    KendoDynamicPagingDirective,
    TimesPipe,
    SkeletonModule,
    NoteTypeBadgeComponent,
    RelatedNotesTableComponent,
    LoaderModule,
  ],
  templateUrl: './opportunities-related-notes.component.html',
  styleUrls: ['./opportunities-related-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fadeIn', fadeIn())],
})
export class OpportunitiesRelatedNotesComponent {
  protected store = inject(Store);
  protected actions = inject(Actions);

  protected uploadFileService = inject(UploadFileService);

  protected formGroup = new FormRecord({});

  protected state = signal(
    {
      disabledForm: false,
      updatingField: null as null | string,
      state: 'edit' as 'edit' | 'validate' | 'updated',
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
      .pipe(
        takeUntilDestroyed(),
        ofType(NotesActions.updateNoteSuccess, NotesActions.updateNoteFailure),
      )
      .subscribe(() => {
        this.state.update((state) => ({
          ...state,
          state: 'edit',
          updatingField: null,
        }));
      });
  }

  public onValueChange(formControlName: string): void {
    this.state.update((state) => ({
      ...state,
      updatingField: formControlName,
      state: 'edit',
    }));
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
              id: this.vm().allFields.find((x) => x.uniqId === id)?.id,
              value: value ?? '',
            }))
            .value(),
          tagIds: this.vm().opportunityNote.tags.map((x: any) => x.id),
          origin: this.vm().opportunityNote,
          opportunityId: this.vm().opportunityId,
        },
      }),
    );
  }
}
