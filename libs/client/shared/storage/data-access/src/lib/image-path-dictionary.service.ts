import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { storageQuery } from './+state/storage.selectors';

export type ImagePathTranslations = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class ImagePathDictionaryService {
  private store = inject(Store);
  private dictionary = this.store.selectSignal(
    storageQuery.selectAzureImageDictionary,
  );

  public getImageDictionary(): ImagePathTranslations {
    return _.chain(this.dictionary() ?? {})
      .mapKeys((x) => x!.fileName)
      .mapValues((x) => x!.url)
      .value();
  }
}
