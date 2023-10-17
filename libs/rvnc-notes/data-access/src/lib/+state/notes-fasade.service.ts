//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { NoteData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';
import { NotesActions } from './notes.actions';
import { notesQuery } from './notes.selectors';

@Injectable()
export class NoteStoreFacadeService {
  notes$: Observable<NoteData[]> = this.store.pipe(
    select(notesQuery.selectAllNotes),
  );
  error$: Observable<string | null> = this.store.pipe(
    select(notesQuery.selectError),
  );
  isLoading$: Observable<boolean> = this.store.pipe(
    select(notesQuery.selectIsLoading),
  );

  constructor(private store: Store) {}

  getNotes(): void {
    this.store.dispatch(NotesActions.getNotes());
  }
}
