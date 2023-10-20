import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';

@Injectable()
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
}
