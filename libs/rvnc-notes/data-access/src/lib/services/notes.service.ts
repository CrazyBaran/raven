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

  public getNotes(): Observable<GenericResponse<NoteData[]>> {
    return this.http.get<GenericResponse<NoteData[]>>('/api/notes');
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
  ): Observable<GenericResponse<NoteData>> {
    return this.http.post<GenericResponse<NoteData>>('/api/notes', createNote);
  }

  public patchNote(
    noteId: string,
    patchNote: PatchNote,
  ): Observable<GenericResponse<NoteData>> {
    return this.http.patch<GenericResponse<NoteData>>(
      `/api/notes/${noteId}`,
      patchNote,
    );
  }
}
