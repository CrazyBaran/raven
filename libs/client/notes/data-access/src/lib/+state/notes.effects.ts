import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationsActions } from '@app/client/shared/util-notifications';
import { NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';
import { NotesService } from '../services/notes.service';
import { NotesActions } from './notes.actions';

@Injectable()
export class NotesEffects {
  private loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNotes),
      concatMap(({ domain, tagIds }) =>
        this.notesService.getNotes(domain, tagIds).pipe(
          map(({ data }) => NotesActions.getNotesSuccess({ data: data || [] })),
          catchError((error) => of(NotesActions.getNotesFailure({ error }))),
        ),
      ),
    );
  });

  private loadNoteDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNoteDetails),
      concatMap(({ id }) =>
        this.notesService.getNoteDetails(id).pipe(
          map(({ data }) =>
            NotesActions.getNoteDetailsSuccess({
              data: data as NoteWithRelationsData,
            }),
          ),
          catchError((error) =>
            of(NotesActions.getNoteDetailsFailure({ error })),
          ),
        ),
      ),
    );
  });

  private createNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.createNote),
      concatMap(({ data }) =>
        this.notesService.createNote(data).pipe(
          switchMap(({ data }) => [
            NotesActions.createNoteSuccess({ data: data! }),
            NotificationsActions.showSuccessNotification({
              content: 'Note created successfully',
            }),
          ]),
          catchError((error) => of(NotesActions.createNoteFailure({ error }))),
        ),
      ),
    );
  });

  private updateNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.updateNote),
      concatMap(({ noteId, data }) =>
        this.notesService.patchNote(noteId, data).pipe(
          map(({ data }) =>
            NotesActions.updateNoteSuccess({ data: data!, originId: noteId }),
          ),
          catchError((error) => of(NotesActions.updateNoteFailure({ error }))),
        ),
      ),
    );
  });

  private deleteNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.deleteNote),
      concatMap(({ noteId }) =>
        this.notesService.deleteNote(noteId).pipe(
          switchMap(() => [
            NotesActions.deleteNoteSuccess({ noteId: noteId }),
            NotificationsActions.showSuccessNotification({
              content: 'Note Deleted.',
            }),
          ]),
          catchError((error) => of(NotesActions.deleteNoteFailure({ error }))),
        ),
      ),
    );
  });

  public constructor(
    private readonly actions$: Actions,
    private readonly notesService: NotesService,
  ) {}
}
