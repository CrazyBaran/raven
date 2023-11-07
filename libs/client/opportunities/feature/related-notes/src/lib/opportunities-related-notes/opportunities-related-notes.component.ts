import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotesActions, notesQuery } from '@app/client/opportunities/api-notes';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { RichTextComponent } from '@app/client/shared/dynamic-form-util';
import { SafeHtmlPipe } from '@app/client/shared/pipes';
import { LoaderComponent } from '@app/client/shared/ui';
import { routerQuery } from '@app/client/shared/util-router';
import { NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ExpansionPanelModule,
  TileLayoutModule,
} from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import * as _ from 'lodash';
import { distinctUntilChanged, map } from 'rxjs';

export const selectOpportunitiesRelatedNotesViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  routerQuery.selectActiveType,
  notesQuery.selectAllNotes,
  getRouterSelectors().selectQueryParam('noteIndex'),
  notesQuery.selectIsLoading,
  notesQuery.selectNoteDetailsIsLoading,
  (opportunity, type, notes, noteIndex, notesLoading, notesDetailLoading) => {
    const relatedNotes = notes.slice(0, 12);
    const index =
      noteIndex && +noteIndex > 0 && +noteIndex < relatedNotes.length
        ? +noteIndex
        : 0;

    const relatedNote = noteIndex
      ? relatedNotes[+noteIndex] ?? relatedNotes[0]
      : relatedNotes[0];
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: (opportunity as any)?.[type ?? ''] ?? [],
      relatedNotes,
      relatedNote: relatedNote,
      relatedNoteFields: _.chain(
        (relatedNote as NoteWithRelationsData)?.noteFieldGroups ?? [],
      )
        .map((x) => x.noteFields)
        .flatMap()
        .filter(({ value }) => Boolean(value?.trim()))
        .value(),
      nextQueryParam: { noteIndex: index + 1 },
      disabledNext: index + 1 >= relatedNotes.length,
      prevQueryParam: { noteIndex: index - 1 },
      disabledPrev: index - 1 < 0,
      index,
      notesLoading,
      notesDetailLoading,
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
  ],
  templateUrl: './opportunities-related-notes.component.html',
  styleUrls: ['./opportunities-related-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesRelatedNotesComponent {
  protected store = inject(Store);

  protected formGroup: FormGroup = new FormRecord({});

  protected vm = this.store.selectSignal(
    selectOpportunitiesRelatedNotesViewModel,
  );

  protected relatedNote$ = this.store
    .select(selectOpportunitiesRelatedNotesViewModel)
    .pipe(
      map(({ relatedNote }) => relatedNote?.id),
      distinctUntilChanged(),
    );

  public constructor() {
    // this.vm().fields.forEach(({ id, value }) => {
    //   this.formGroup.addControl(id, new FormControl(value));
    // });

    this.store.dispatch(NotesActions.getNotes({}));

    this.relatedNote$.pipe(takeUntilDestroyed()).subscribe((id) => {
      if (id) {
        this.store.dispatch(NotesActions.getNoteDetails({ id }));
      }
    });

    effect(() => {
      const value = _.chain(this.vm().fields)
        .keyBy('id')
        .mapValues(({ value }) => new FormControl(value))
        .value();
      this.formGroup = new FormGroup(value);
    });
  }
}
