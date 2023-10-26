import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';
import { CreateNote, PatchNote } from '../domain/createNote';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public constructor(private http: HttpClient) {}

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
    return this.http.get<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${id}`,
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

  public deleteNote(
    noteId: string,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.delete<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
    );
  }
}
