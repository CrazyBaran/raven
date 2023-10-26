//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { ImagePathDictionaryService } from '@app/rvnc-storage/data-access';
import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { map, Observable } from 'rxjs';
import { CreateNote, PatchNote } from '../domain/createNote';
import { NotesActions } from './notes.actions';
import { notesFeature } from './notes.reducer';
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

  public isCreatingNote = this.store.selectSignal(
    notesFeature.selectIsCreatePending,
  );

  public noteDetails$: Observable<NoteWithRelationsData | null> = this.store
    .pipe(select(notesQuery.selectNoteDetails))
    .pipe(
      map((x) => ({
        ...x!,
        noteFieldGroups:
          x?.noteFieldGroups?.map((fields) => ({
            ...fields,
            noteFields: fields.noteFields.map((field) => ({
              ...field,
              value: Object.entries(
                this.imagePathDictionaryService.getImageDictionary(),
              ).reduce(
                (acc, [file, url]) => acc.replace(file, url),
                field.value ?? '',
              ),
            })),
          })) ?? [],
      })),
    );

  public isLoadingNoteDetails$: Observable<boolean> = this.store.pipe(
    select(notesQuery.selectNoteDetailsIsLoading),
  );

  public isUpdatingNote = this.store.selectSignal(
    notesQuery.selectNoteUpdateIsLoading,
  );

  public constructor(
    private store: Store,
    private imagePathDictionaryService: ImagePathDictionaryService,
  ) {}

  public getNotes(domain?: string, tagIds?: string): void {
    this.store.dispatch(NotesActions.getNotes({ domain, tagIds }));
  }

  public getNoteDetails(id: string): void {
    this.store.dispatch(NotesActions.getNoteDetails({ id }));
  }

  public createNote(data: CreateNote & PatchNote): void {
    this.store.dispatch(
      NotesActions.createNote({
        data,
      }),
    );
  }

  public updateNote(noteId: string, data: PatchNote): void {
    this.store.dispatch(
      NotesActions.updateNote({
        data,
        noteId,
      }),
    );
  }

  public deleteNote(noteId: string): void {
    this.store.dispatch(
      NotesActions.deleteNote({
        noteId,
      }),
    );
  }
}
