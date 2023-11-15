import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// TODO: refactor storage lib
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ImagePathDictionaryService } from '@app/client/shared/storage/data-access';
import { GenericResponse } from '@app/rvns-api';
import {
  NoteAttachmentData,
  NoteData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { Observable, map, switchMap, tap } from 'rxjs';
import { CreateNote, PatchNote } from '../domain/createNote';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public constructor(
    private http: HttpClient,
    private imagePathDictionaryService: ImagePathDictionaryService,
  ) {}

  public getNotes(
    domain?: string,
    tagIds?: string,
  ): Observable<GenericResponse<NoteData[]>> {
    const params: Record<string, string> = Object.fromEntries(
      Object.entries({ domain, tagIds }).filter(
        ([, v]) => typeof v !== 'undefined',
      ),
    ) as Record<string, string>;

    return this.http.get<GenericResponse<NoteData[]>>('/api/notes', {
      params,
    });
  }

  public getNoteDetails(
    id: string,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http
      .get<GenericResponse<NoteWithRelationsData>>(`/api/notes/${id}`)
      .pipe(
        switchMap((note) => {
          return this.getNoteAttachments(id).pipe(
            tap((response) => {
              this.imagePathDictionaryService.addImagesToDictionary(
                response.data ?? [],
              );
            }),
            map((attachmentResponse) => ({
              ...note,
            })),
          );
        }),
      );
  }

  public createNote(
    createNote: CreateNote,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.post<GenericResponse<NoteWithRelationsData>>(
      '/api/notes',
      createNote,
    );
  }

  public patchNote(
    noteId: string,
    patchNote: PatchNote,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.patch<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
      patchNote,
    );
  }

  public getNoteAttachments(
    id: string,
  ): Observable<GenericResponse<NoteAttachmentData[]>> {
    return this.http.get<GenericResponse<NoteAttachmentData[]>>(
      `/api/notes/${id}/attachments`,
    );
  }

  public deleteNote(
    noteId: string,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.delete<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
    );
  }
}
