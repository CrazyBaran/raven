//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { NoteData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';
import { NotesActions } from './notes.actions';
import { notesQuery } from './notes.selectors';

@Injectable()
export class NoteStoreFacadeService {
  public notes$: Observable<NoteData[]> = this.store.pipe(
    select(notesQuery.selectAllNotes),
  );
  public error$: Observable<string | null> = this.store.pipe(
    select(notesQuery.selectError),
  );
  public isLoading$: Observable<boolean> = this.store.pipe(
    select(notesQuery.selectIsLoading),
  );

  public constructor(private store: Store) {}

  public getNotes(): void {
    this.store.dispatch(NotesActions.getNotes());
  }
}
