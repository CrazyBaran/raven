import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ImagePathTranslations = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class ImagePathDictionaryService {
  private imageDictionary: BehaviorSubject<ImagePathTranslations> =
    new BehaviorSubject({});

  public addImageToDictionary(
    fileName: string | undefined,
    url: string | undefined,
  ): void {
    if (!fileName || !url) return;

    const images = this.imageDictionary.value;
    this.imageDictionary.next({
      ...images,
      [fileName]: url,
    });
  }

  public addImagesToDictionary(
    files: { fileName: string; url: string }[],
  ): void {
    this.imageDictionary.next({
      ...this.imageDictionary.value,
      ...files.reduce(
        (acc, { fileName, url }) => ({ ...acc, [fileName]: url }),
        {},
      ),
    });
  }

  public getImageUrl(fileName: string): string {
    return this.imageDictionary.value[fileName];
  }

  public getImageDictionary(): ImagePathTranslations {
    return this.imageDictionary.value;
  }
}
