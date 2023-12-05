import { OpportunityTeamData } from '@app/rvns-opportunities';

export function getDealLeads(
  team: OpportunityTeamData | undefined | null,
): string[] {
  return team?.owners.map((owner) => owner?.actorName) || [];
}
