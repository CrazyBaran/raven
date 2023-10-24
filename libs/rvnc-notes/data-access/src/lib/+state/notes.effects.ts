import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { NotificationService } from '@progress/kendo-angular-notification';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { NotesService } from '../services/notes.service';
import { NotesActions } from './notes.actions';

@Injectable()
export class NotesEffects {
  private loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNotes),
      concatMap(() =>
        this.notesService.getNotes().pipe(
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
          map(({ data }) => NotesActions.createNoteSuccess({ data: data! })),
          catchError((error) => of(NotesActions.createNoteFailure({ error }))),
        ),
      ),
    );
  });

  private successNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotesActions.createNoteSuccess),
        tap(() =>
          this.notificationService.show({
            content: 'Note created successfully',
            cssClass: 'success',
            type: { style: 'success', icon: true },
            animation: { type: 'slide', duration: 400 },
            position: { horizontal: 'center', vertical: 'top' },
          }),
        ),
      ),
    { dispatch: false },
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly notesService: NotesService,
    private notificationService: NotificationService,
  ) {}
}
