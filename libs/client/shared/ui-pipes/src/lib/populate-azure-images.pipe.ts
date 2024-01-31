import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  AzureImageEntity,
  storageQuery,
} from '@app/client/shared/storage/data-access';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'populateAzureImages',
  standalone: true,
})
export class PopulateAzureImagesPipe implements PipeTransform {
  public store = inject(Store);

  public transform(value: string): Observable<string> {
    return populateAzureImages$(value, this.store);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const populateAzureImages$ = (value: string, store: Store) =>
  store
    .select(storageQuery.selectAzureImageDictionary)
    .pipe(
      map((azureImageDictionary) =>
        populateAzureImages(value, azureImageDictionary),
      ),
    );

export const populateAzureImages = (
  value: string,
  azureImageDictionary: Dictionary<AzureImageEntity>,
): string => {
  return Object.entries(azureImageDictionary).reduce(
    (acc, [file, iamge]) => acc.replace(file, iamge?.url ?? ''),
    value ?? '',
  );
};
