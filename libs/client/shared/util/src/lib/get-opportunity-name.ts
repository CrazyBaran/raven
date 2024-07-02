import { OpportunityData } from '../../../../../rvns-opportunities/src';

export function getOpportunityName(
  opportunity: OpportunityData | undefined | null,
): string {
  const opportunityTagName = opportunity?.tag?.name ?? '';
  let opportunityName = '';
  if (opportunity?.name) {
    opportunityName += `${opportunity.name}${
      opportunityTagName ? ` (${opportunityTagName})` : 'No opportunity'
    }`;
  } else {
    opportunityName = !!opportunityTagName
      ? opportunityTagName
      : 'No opportunity';
  }

  return opportunityName;
}
