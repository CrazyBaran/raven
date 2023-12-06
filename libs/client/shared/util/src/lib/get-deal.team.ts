// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityTeamData } from '@app/rvns-opportunities';

export function getDealTeam(
  team: OpportunityTeamData | undefined | null,
): string[] {
  if (!team || team.members?.length === 0) {
    return [];
  }

  return team?.members.map((owner) => owner?.actorName);
}
