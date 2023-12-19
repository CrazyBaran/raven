import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  StorageActions,
  storageQuery,
} from '@app/client/shared/storage/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { routerQuery } from '@app/client/shared/util-router';
import { NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { catchError, concatMap, filter, map, of, switchMap } from 'rxjs';
import { NotesService } from '../services/notes.service';
import { NotesActions } from './notes.actions';

@Injectable()
export class NotesEffects {
  private loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNotes),
      switchMap(({ params }) =>
        this.notesService.getNotes(params).pipe(
          map(({ data }) =>
            NotesActions.getNotesSuccess({
              data: data?.items || [],
              total: data?.total ?? 0,
            }),
          ),
          catchError((error) => of(NotesActions.getNotesFailure({ error }))),
        ),
      ),
    );
  });

  private loadCurrentNoteDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getCurrentNoteDetails),
      concatLatestFrom(() =>
        this.store.select(routerQuery.selectNoteDetailsId),
      ),
      filter(([_, id]) => !!id),
      map(([_, id]) => NotesActions.getNoteDetails({ id: id! })),
    );
  });

  private loadNoteDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNoteDetails),
      concatMap(({ id }) =>
        this.notesService.getNoteDetails(id).pipe(
          switchMap(({ data }) => [
            NotesActions.getNoteDetailsSuccess({
              data: data as NoteWithRelationsData,
            }),
            StorageActions.addImages({
              images:
                data?.noteAttachments?.map((attachment) => ({
                  fileName: attachment.fileName,
                  url: attachment.url,
                })) ?? [],
            }),
          ]),
          catchError((error) =>
            of(NotesActions.getNoteDetailsFailure({ error })),
          ),
        ),
      ),
    );
  });

  private loadNoteAttachmets = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNoteAttachments),
      concatMap(({ id }) =>
        this.notesService.getNoteAttachments(id).pipe(
          switchMap(({ data }) => [
            NotesActions.getNotesAttachmentsSuccess({ id }),
            StorageActions.addImages({
              images:
                data?.map((attachment) => ({
                  fileName: attachment.fileName,
                  url: attachment.url,
                })) ?? [],
            }),
          ]),
          catchError((error) =>
            of(NotesActions.getNotesAttachmentsFailure({ id })),
          ),
        ),
      ),
    );
  });

  private loadOpportunityNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getOpportunityNotes),
      switchMap(({ opportunityId }) =>
        this.notesService.getOpportunityNotes(opportunityId).pipe(
          switchMap((data) => [
            NotesActions.getOpportunityNotesSuccess({ data: [data!] || [] }),
            StorageActions.addImages({
              images:
                data?.noteAttachments?.map((attachment) => ({
                  fileName: attachment.fileName,
                  url: attachment.url,
                })) ?? [],
            }),
          ]),
          catchError((error) =>
            of(NotesActions.getOpportunityNotesFailure({ error })),
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
      concatLatestFrom(() =>
        this.store.select(storageQuery.selectAzureImageDictionary),
      ),
      map(([{ noteId, data }, dictionary]) => ({
        noteId,
        data: {
          ...data,
          fields: data.fields.map(({ id, value }) => {
            const clearedValue = Object.entries(
              _.chain(dictionary ?? {})
                .mapKeys((x) => x!.fileName)
                .mapValues((x) => x!.url)
                .value(),
            ).reduce(
              (acc, [fileName, sasUrl]) => {
                return acc
                  .replace(new RegExp('&amp;', 'g'), '&')
                  .replace(sasUrl, fileName);
              },
              String(value) ?? '',
            );
            return { id, value: clearedValue || '' };
          }),
        },
      })),
      switchMap(({ noteId, data }) =>
        this.notesService.patchNote(noteId, data).pipe(
          switchMap(({ data }) => [
            NotesActions.updateNoteSuccess({ data: data!, originId: noteId }),
            NotificationsActions.showSuccessNotification({
              content: 'Fields updated successfully.',
            }),
          ]),
          catchError((error) =>
            of(
              NotesActions.updateNoteFailure({ error, originId: noteId }),
              NotificationsActions.showErrorNotification({
                content: 'Note update failed.',
              }),
            ),
          ),
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
    private readonly store: Store,
  ) {}
}
