import { inject, Pipe, PipeTransform } from '@angular/core';
import { storageQuery } from '@app/client/shared/storage/data-access';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'populateAzureImages',
  standalone: true,
})
export class PopulateAzureImagesPipe implements PipeTransform {
  public store = inject(Store);

  public transform(value: string): Observable<string> {
    return this.store.select(storageQuery.selectAzureImageDictionary).pipe(
      map((azureImageDictionary) => {
        return Object.entries(azureImageDictionary).reduce(
          (acc, [file, iamge]) => acc.replace(file, iamge?.url ?? ''),
          value ?? '',
        );
      }),
    );
  }
}
1;
