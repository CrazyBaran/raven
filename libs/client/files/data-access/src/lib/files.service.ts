import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types-beta';

import { GenericResponse } from '@app/rvns-api';
import { FileData } from '@app/rvns-files';
import {
  exhaustMap,
  filter,
  interval,
  Observable,
  of,
  switchMap,
  take,
  zip,
} from 'rxjs';
import { File } from './models/file.model';

export type GraphQLResponse<T> = {
  '@odata.context': string;
  value: T;
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  public constructor(private http: HttpClient) {}

  public getFiles(params?: {
    directoryUrl: string;
  }): Observable<GraphQLResponse<File[]>> {
    return this.http.get<GraphQLResponse<File[]>>(params!.directoryUrl);
  }

  public getFileById(params: {
    itemsUrl: string;
    itemId: string;
  }): Observable<File> {
    return this.http.get<File>(`${params.itemsUrl}/${params.itemId}`);
  }

  public getFilesByTags(params: {
    directoryUrl: string;
    opportunityId: string;
    tags: string[];
  }): Observable<File[]> {
    return this.http
      .get<GenericResponse<FileData[]>>(
        `/api/opportunities/${params.opportunityId}/files`,
        {
          params: { tagIds: params.tags },
        },
      )
      .pipe(
        switchMap((res) => {
          return res.data?.length
            ? zip(
                res.data!.map((el) =>
                  this.getFileById({
                    itemsUrl: `${
                      params.directoryUrl.split('/items/')[0]
                    }/items`,
                    itemId: el.internalSharepointId,
                  }),
                ),
              )
            : of([]);
        }),
      );
  }

  public updateFileTags(params: {
    opportunityId: string;
    id: string;
    tags: string[];
  }): Observable<GenericResponse<FileData>> {
    return this.http.patch<GenericResponse<FileData>>(
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
  ): Observable<MicrosoftGraph.LongRunningOperation> {
    return this.http
      .post(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/copy`,
        params,
        {
          observe: 'response',
        },
      )
      .pipe(
        switchMap((x) => {
          const monitorUrl = x.headers.get('Location');
          return interval(200).pipe(
            exhaustMap(() =>
              this.http.get<MicrosoftGraph.LongRunningOperation>(monitorUrl!),
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter((res) => res.status !== ('inProgress' as any)),
            take(1),
          );
        }),
      );
  }
}
