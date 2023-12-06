import { Pipe, PipeTransform } from '@angular/core';
import { getDealTeam } from '@app/client/shared/util';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityTeamData } from '@app/rvns-opportunities';

@Pipe({
  name: 'dealTeam',
  standalone: true,
})
export class DealTeamPipe implements PipeTransform {
  public transform(team: OpportunityTeamData | undefined | null): string[] {
    return getDealTeam(team);
  }
}
