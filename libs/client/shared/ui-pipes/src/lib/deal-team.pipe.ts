import { Pipe, PipeTransform } from '@angular/core';
import { getDealTeam } from '@app/client/shared/util';

@Pipe({
  name: 'dealTeam',
  standalone: true,
})
export class DealTeamPipe implements PipeTransform {
  public transform(
    fields:
      | {
          displayName: string;
          value: string | number | object | object[];
        }[]
      | undefined
      | null,
  ): string[] {
    return getDealTeam(fields);
  }
}
