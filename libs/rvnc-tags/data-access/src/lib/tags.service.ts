import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { TagData } from '@app/rvns-tags';
import { Observable } from 'rxjs';
import { CreateTagData } from './models/create-tag-data.model';

import { CreateTagResponse } from './models/create-tag-response';

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
