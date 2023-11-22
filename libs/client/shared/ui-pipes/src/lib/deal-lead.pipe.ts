import { Pipe, PipeTransform } from '@angular/core';
import { getDealLeads } from '@app/client/shared/util';

@Pipe({
  name: 'dealLeads',
  standalone: true,
})
export class DealLeadsPipe implements PipeTransform {
  public transform(
    fields:
      | {
          displayName: string;
          value: string | number | object | object[];
        }[]
      | undefined
      | null,
  ): string[] {
    return getDealLeads(fields);
  }
}
