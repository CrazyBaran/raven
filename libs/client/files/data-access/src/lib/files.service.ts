import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericResponse } from '@app/rvns-api';
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

  public updateFileTags(params: {
    opportunityId: string;
    id: string;
    tags: string[];
  }): Observable<GenericResponse<File>> {
    return this.http.post<GenericResponse<File>>(
      `/api/opportunities/${params.opportunityId}/files/${params.id}`,
      {
        tagIds: params.tags,
      },
    );
  }

  public copyFile(
    siteId: string,
    itemId: string,
    params: {
      parentReference: {
        driveId: string;
        id: string;
      };
    },
  ): Observable<unknown> {
    return this.http.post(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/copy`,
      params,
    );
  }
}
