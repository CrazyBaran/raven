import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types-beta';

import { GenericResponse } from '@app/rvns-api';
import { FileData } from '@app/rvns-files';
import * as _ from 'lodash';
import {
  EMPTY,
  Observable,
  exhaustMap,
  expand,
  filter,
  forkJoin,
  interval,
  map,
  of,
  reduce,
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
    directoryUrl: string | string[];
  }): Observable<File[]> {
    return forkJoin(
      _.castArray(params!.directoryUrl).map((url) =>
        this.http.get<GraphQLResponse<File[]>>(url),
      ),
    ).pipe(map((responses) => _.flatten(responses.map((x) => x.value))));
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

  public getFilesRecursive(
    directoryUrl: string,
    sharepointSiteId: string,
  ): Observable<File[]> {
    return this.getFiles({ directoryUrl }).pipe(
      expand((files) => {
        const foldersWithChildren = files.filter((x) => x.folder?.childCount);
        if (foldersWithChildren.length === 0) {
          return EMPTY;
        }
        return this.getFiles({
          directoryUrl: foldersWithChildren.map(
            (x) =>
              `https://graph.microsoft.com/v1.0/sites/${sharepointSiteId}/drive/items/${x.id}/children`,
          ),
        });
      }),
      reduce((acc, x) => acc.concat(x), [] as File[]),
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
