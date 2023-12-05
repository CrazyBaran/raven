import { Pipe, PipeTransform } from '@angular/core';
import { getDealLeads } from '@app/client/shared/util';
import { OpportunityTeamData } from '@app/rvns-opportunities';

@Pipe({
  name: 'dealLeads',
  standalone: true,
})
export class DealLeadsPipe implements PipeTransform {
  public transform(team: OpportunityTeamData | undefined | null): string[] {
    return getDealLeads(team);
  }
}
