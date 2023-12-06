// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityTeamData } from '@app/rvns-opportunities';

export function getDealLeads(
  team: OpportunityTeamData | undefined | null,
): string[] {
  if (!team || team.owners?.length === 0) {
    return [];
  }
  return team?.owners.map((owner) => owner?.actorName);
}
