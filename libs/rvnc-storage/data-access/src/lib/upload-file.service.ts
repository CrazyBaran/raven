import { inject, Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { last, mergeMap, Observable, tap } from 'rxjs';
import { ImagePathDictionaryService } from './image-path-dictionary.service';
import { StoragePostResponse } from './models/storage-post-response.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private imagePathDictionaryService = inject(ImagePathDictionaryService);
  private storageService = inject(StorageService);

  public uploadFile(
    file: File,
    rootId: string,
  ): Observable<GenericResponse<StoragePostResponse>> {
    return this.storageService
      .post({
        fileName: 'test.png',
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
          this.imagePathDictionaryService.addImageToDictionary(
            res.data?.fileName,
            res.data?.sasToken,
          );
        }),
      );
  }
}
