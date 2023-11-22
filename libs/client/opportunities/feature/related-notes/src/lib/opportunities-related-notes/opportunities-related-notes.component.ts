//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { SortDescriptor } from '@progress/kendo-data-query';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';

import { SkeletonModule } from '@progress/kendo-angular-indicators';
import * as _ from 'lodash';
import { Subject, firstValueFrom, map, merge } from 'rxjs';
import { selectOpportunitiesRelatedNotesViewModel } from './opportunities-related-notes.selectors';

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
  ],
  templateUrl: './opportunities-related-notes.component.html',
  styleUrls: ['./opportunities-related-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesRelatedNotesComponent {
  public sort: SortDescriptor[] = [
    {
      field: 'updatedAt',
      dir: 'desc',
    },
  ];

  protected store = inject(Store);
  protected uploadFileService = inject(UploadFileService);

  protected formGroup: FormGroup = new FormRecord({});
  protected destroyRef = inject(DestroyRef);

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

  protected vm = this.store.selectSignal(
    selectOpportunitiesRelatedNotesViewModel,
  );

  protected fields$ = this.store
    .select(selectOpportunitiesRelatedNotesViewModel)
    .pipe(map(({ fields }) => fields));

  protected itemsRendered = new Subject<any[]>();
  protected startRender = new Subject<void>();

  protected visible = toSignal(
    merge(
      this.startRender.pipe(map(() => false)),
      this.itemsRendered.pipe(map(() => true)),
    ),
  );

  public constructor() {
    this.fields$.pipe(distinctUntilChangedDeep()).subscribe(() => {
      this.startRender.next();
    });

    effect(
      () => {
        const value = _.chain(this.vm().fields)
          .keyBy('id')
          .mapValues(
            ({ value }) => new FormControl(value, { updateOn: 'blur' }),
          )
          .value();
        this.formGroup = new FormGroup(value);
        this.formGroup.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.store.dispatch(
              NotesActions.updateNote({
                noteId: this.vm().opportunityNoteId,
                data: {
                  name: this.vm().opportunityNote.name,
                  fields: _.chain(value as Record<string, unknown>)
                    .map((value, id) => ({ id, value: value ?? '' }))
                    .value(),
                  tagIds: this.vm().opportunityNote.tags.map((x: any) => x.id),
                },
              }),
            );
          });
      },
      {
        allowSignalWrites: true,
      },
    );
  }
}
