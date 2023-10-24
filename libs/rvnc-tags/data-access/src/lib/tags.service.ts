import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { CreateTagData, CreateTagResponse, TagData } from '@app/rvns-tags';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private url = '/api/tags';

  public constructor(private http: HttpClient) {}

  public getNotes(): Observable<GenericResponse<TagData[]>> {
    return this.http.get<GenericResponse<TagData[]>>(this.url);
  }

  public createTag(
    createNote: CreateTagData,
  ): Observable<GenericResponse<CreateTagResponse>> {
    return this.http.post<GenericResponse<CreateTagResponse>>(
      this.url,
      createNote,
    );
  }
}
