import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { NotesService } from '@app/client/notes/data-access';
import { OrganisationsActions } from '@app/client/organisations/state';
import {
  StorageActions,
  storageQuery,
} from '@app/client/shared/storage/data-access';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { routerQuery } from '@app/client/shared/util-router';
import { NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import {
  catchError,
  combineLatest,
  concatMap,
  filter,
  map,
  of,
  switchMap,
} from 'rxjs';
import { NotesActions } from './notes.actions';
import { notesQuery } from './notes.selectors';

@Injectable()
export class NotesEffects {
  private loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.getNotes),
      concatMap(({ params, append }) =>
        this.notesService.getNotes(params).pipe(
          map(({ data }) =>
            NotesActions.getNotesSuccess({
              data: data?.items || [],
              total: data?.total ?? 0,
              append: append,
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
          switchMap((res) => [
            NotesActions.createNoteSuccess({ data: res.data! }),
            NotificationsActions.showSuccessNotification({
              content: 'Note created successfully',
            }),
            NotesActions.replaceDisabledNoteTabs({
              beforeSaveTabIds: data.fields
                .filter((el) => el.id)
                .map((el) => el.id!),
              afterSave:
                res.data?.noteFieldGroups[0].noteFields.map((el) => ({
                  id: el.id,
                  label: el.name,
                })) ?? [],
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
          switchMap((res) => [
            NotesActions.updateNoteSuccess({
              data: res.data!,
              originId: noteId,
            }),
            NotificationsActions.showSuccessNotification({
              content: 'Fields updated successfully.',
            }),
            NotesActions.replaceDisabledNoteTabs({
              beforeSaveTabIds: data.fields
                .filter((el) => el.id)
                .map((el) => el.id!),
              afterSave: res.data?.noteFieldGroups?.length
                ? res.data.noteFieldGroups[0].noteFields.map((el) => ({
                    id: el.id,
                    label: el.name,
                  }))
                : [],
            }),
          ]),
          catchError((error) => {
            const errorMessage: string | undefined = error?.error?.message;
            const errorContent = errorMessage?.startsWith('verbose:')
              ? errorMessage.split('verbose:')[1]
              : 'Note update failed.';
            return of(
              NotesActions.updateNoteFailure({ error, originId: noteId }),
              NotificationsActions.showErrorNotification({
                content: errorContent,
              }),
            );
          }),
        ),
      ),
    );
  });

  private refreshNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.refreshNote),
      switchMap(({ noteId, newSyncId }) =>
        this.notesService.getNoteDetails(newSyncId).pipe(
          switchMap(({ data }) => [
            NotesActions.updateNoteSuccess({ data: data!, originId: noteId }),
            NotificationsActions.showSuccessNotification({
              content: 'Note refreshed successfully.',
            }),
          ]),
          catchError((error) =>
            of(
              NotesActions.updateNoteFailure({ error, originId: noteId }),
              NotificationsActions.showErrorNotification({
                content: 'Note refresh failed.',
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

  private refreshNotes = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotesActions.refreshNotesTable),
      concatLatestFrom(() =>
        combineLatest({
          params: this.store.select(notesQuery.selectNotesTableParams),
          table: this.store.select(notesQuery.selectTable),
        }),
      ),
      switchMap(([_, { params, table }]) =>
        this.notesService
          .getNotes({
            ...params,
            take: (table ? table.ids.length + 10 : 0).toString(),
          })
          .pipe(
            map(({ data }) => {
              return NotesActions.refreshNotesTableSuccess({
                data: data?.items || [],
                total: data?.total ?? 0,
              });
            }),
            catchError((error) =>
              of(
                OrganisationsActions.refreshOrganisationsFailure({
                  error,
                  message: 'Failed to refresh notes',
                }),
              ),
            ),
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
