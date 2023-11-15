/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
// TODO:refactor
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GenericResponse } from '@app/rvns-api';
import { Observable } from 'rxjs';
import { StoragePostResponse } from './models/storage-post-response.interface';
import { StoragePost } from './models/storage-post.interface';
import { StoragePut } from './models/storage-put.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private url = '/api/storage-account';

  public constructor(private http: HttpClient) {}

  public get(): Observable<GenericResponse<any>> {
    return this.http.get<GenericResponse<any>>(`${this.url}`);
  }

  public post(
    payload: StoragePost,
  ): Observable<GenericResponse<StoragePostResponse>> {
    return this.http.post<GenericResponse<StoragePostResponse>>(
      `${this.url}`,
      payload,
    );
  }

  public put(payload: StoragePut): Observable<HttpEvent<object>> {
    return this.http
      .put(payload.sasToken, payload.blob, {
        reportProgress: true,
        observe: 'events',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
        },
      })
      .pipe();
  }
}
