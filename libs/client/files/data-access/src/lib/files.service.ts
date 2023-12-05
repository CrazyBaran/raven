import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { File } from './models/file.model';

export type GraphQLResponse<T> = {
  '@odata.context': string;
  value: T;
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private url = '/api/files';

  public constructor(private http: HttpClient) {}

  public getFiles(params?: {
    directoryUrl: string;
  }): Observable<GraphQLResponse<File[]>> {
    return this.http.get<GraphQLResponse<File[]>>(params!.directoryUrl);
  }
}
