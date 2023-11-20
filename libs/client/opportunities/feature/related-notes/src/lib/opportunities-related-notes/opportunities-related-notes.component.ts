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
import { NotesActions, notesQuery } from '@app/client/opportunities/api-notes';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
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
import { SafeHtmlPipe } from '@app/client/shared/ui-pipes';
import { routerQuery } from '@app/client/shared/util-router';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
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
import * as _ from 'lodash';
import { Subject, firstValueFrom, map, merge } from 'rxjs';

export const selectOpportunityNoteTabs = createSelector(
  notesQuery.selectOpportunityNotes,
  (opportunityNotes) => opportunityNotes?.[0].noteTabs ?? [],
);

export const selectOpportunityNoteTabsDictionary = createSelector(
  selectOpportunityNoteTabs,
  (noteTabs) => _.keyBy(noteTabs, (x) => x.id),
);

export const selectActiveNoteTab = createSelector(
  selectOpportunityNoteTabsDictionary,
  routerQuery.selectActiveTab,
  (opportunityNotes, activeTab) => {
    return activeTab ? opportunityNotes[activeTab] : null;
  },
);

export const selectActiveNoteTabFieldGroup = createSelector(
  selectActiveNoteTab,
  (activeTab) => activeTab?.noteFieldGroups[0],
);

export const selectRelatedNotesWithFields = createSelector(
  selectActiveNoteTab,
  (tab): any =>
    tab && 'relatedNotesWithFields' in tab ? tab.relatedNotesWithFields : [],
);

export const selectRelatedNotes = createSelector(
  selectActiveNoteTab,
  (tab): any => (tab && 'relatedNotes' in tab ? tab.relatedNotes : []),
);

export const selectOpportunityRelatedNotes = createSelector(
  selectRelatedNotesWithFields,
  selectRelatedNotes,
  getRouterSelectors().selectQueryParam('noteIndex'),
  (notesWithFields, notes, visibleNoteWithFieldsIndex) => {
    const relatedNotes = notesWithFields.slice(0, 12);
    const index =
      visibleNoteWithFieldsIndex &&
      +visibleNoteWithFieldsIndex > 0 &&
      +visibleNoteWithFieldsIndex < relatedNotes.length
        ? +visibleNoteWithFieldsIndex
        : 0;

    return {
      notesWithFields,
      notes,
      visibleNoteWithFields: notesWithFields?.length
        ? notesWithFields[visibleNoteWithFieldsIndex ?? 0] ?? notesWithFields[0]
        : null,
      nextQueryParam: { noteIndex: index + 1 },
      disabledNext: index + 1 >= relatedNotes.length,
      prevQueryParam: { noteIndex: index - 1 },
      disabledPrev: index - 1 < 0,
      index,
    };
  },
);

export const selectNoteFields = createSelector(
  notesQuery.selectOpportunityNotes,
  (notes) =>
    _.chain(notes[0]?.noteTabs ?? [])
      .keyBy((x) => x.id)
      .mapValues((x) =>
        x.noteFieldGroups[0].noteFields.map((x: any) => ({
          id: x.id,
          title: x.name,
          value: x.value,
        })),
      )
      .value(),
);

export const selectOpportunitiesRelatedNotesViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  routerQuery.selectActiveTab,
  notesQuery.selectOpportunityNotes,
  selectOpportunityRelatedNotes,
  selectNoteFields,
  (opportunity, tab, opportunityNotes, relatedNotes, fields) => {
    return {
      fields: fields[tab ?? ''] ?? [],
      relatedNoteFields: [],
      opportunityNote: opportunityNotes[0],
      opportunityNoteId: opportunityNotes[0].id,
      ...relatedNotes,
    };
  },
);
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
    this.store.dispatch(NotesActions.getNotes({}));

    this.fields$.pipe(distinctUntilChangedDeep()).subscribe((fields) => {
      this.startRender.next();
    });

    effect(() => {
      this.startRender.next();
      const value = _.chain(this.vm().fields)
        .keyBy('id')
        .mapValues(({ value }) => new FormControl(value, { updateOn: 'blur' }))
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
                templateId: this.vm().opportunityNote.templateId,
                fields: _.chain(value as Record<string, unknown>)
                  .map((value, id) => ({ id, value: value ?? '' }))
                  .value(),
                tagIds: this.vm().opportunityNote.tags.map((x: any) => x.id),
              },
            }),
          );
        });
    });
  }
}
