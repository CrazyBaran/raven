import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { NoteData } from '@app/rvns-notes/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public constructor(private http: HttpClient) {}

  public getNotes(): Observable<GenericResponse<NoteData[]>> {
    return this.http.get<GenericResponse<NoteData[]>>('/api/notes');
  }
}
