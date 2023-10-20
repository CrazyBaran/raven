//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';
import { NotesActions } from './notes.actions';
import { notesQuery } from './notes.selectors';

@Injectable()
export class NoteStoreFacade {
  public notes$: Observable<NoteData[]> = this.store.pipe(
    select(notesQuery.selectAllNotes),
  );
  public error$: Observable<string | null> = this.store.pipe(
    select(notesQuery.selectError),
  );
  public isLoading$: Observable<boolean> = this.store.pipe(
    select(notesQuery.selectIsLoading),
  );

  public noteDetails$: Observable<NoteWithRelationsData | null> =
    this.store.pipe(select(notesQuery.selectNoteDetails));

  public isLoadingNoteDetails$: Observable<boolean> = this.store.pipe(
    select(notesQuery.selectNoteDetailsIsLoading),
  );

  public constructor(private store: Store) {}

  public getNotes(): void {
    this.store.dispatch(NotesActions.getNotes());
  }

  public getNoteDetails(id: string): void {
    this.store.dispatch(NotesActions.getNoteDetails({ id }));
  }
}
