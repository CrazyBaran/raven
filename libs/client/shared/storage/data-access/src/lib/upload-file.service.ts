import { inject, Injectable } from '@angular/core';
//TODO: refactor
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GenericResponse } from '@app/rvns-api';
import { Store } from '@ngrx/store';
import { last, mergeMap, Observable, tap } from 'rxjs';
import { StorageActions } from './+state/storage.actions';
import { StoragePostResponse } from './models/storage-post-response.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private storageService = inject(StorageService);
  private store = inject(Store);

  public uploadFile(
    file: File,
    rootId: string,
  ): Observable<GenericResponse<StoragePostResponse>> {
    return this.storageService
      .post({
        fileName: file.name,
        permission: 'write',
        noteRootVersionId: rootId!,
      })
      .pipe(
        mergeMap((res) =>
          this.storageService
            .put({
              sasToken: res.data!.sasToken,
              blob: file!,
            })
            .pipe(
              last(),
              mergeMap(() => {
                return this.storageService.post({
                  fileName: res.data!.fileName,
                  permission: 'read',
                  noteRootVersionId: rootId!,
                });
              }),
            ),
        ),
        tap((res) => {
          if (res.data?.fileName && res.data?.sasToken) {
            this.store.dispatch(
              StorageActions.addImages({
                images: [
                  { fileName: res.data.fileName, url: res.data.sasToken },
                ],
              }),
            );
          }
        }),
      );
  }
}
