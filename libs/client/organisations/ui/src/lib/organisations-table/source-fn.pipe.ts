import { inject, Pipe, PipeTransform } from '@angular/core';
// TODO: move logic to configuraiton
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OrganisationsService } from '@app/client/organisations/data-access';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  countryTypes,
  dealRoomLastFundingTypes,
  lastFundingTypes,
} from '@app/shared/data-warehouse';
import { map, Observable, of } from 'rxjs';

import { TableColumn } from './models';

@Pipe({
  name: 'sourceFn',
  standalone: true,
})
export class SourceFnPipe implements PipeTransform {
  protected organisationService = inject(OrganisationsService);

  protected sourceDictionary: Record<string, readonly string[]> = {
    'funding.lastFundingType': lastFundingTypes,
    'hq.country': countryTypes,
    'funding.lastFundingRound': dealRoomLastFundingTypes,
  };

  public transform(
    column: TableColumn,
  ): (filter: string) => Observable<string[]> {
    if (column.field === 'industry') {
      return (filter: string) =>
        this.organisationService
          .getIndustries(filter)
          .pipe(map(({ data }) => data ?? []));
    }

    return (filter: string) =>
      of(
        (this.sourceDictionary[column.field] ?? []).filter((x) =>
          x.toLowerCase().includes(filter.toLowerCase()),
        ),
      );
  }
}
