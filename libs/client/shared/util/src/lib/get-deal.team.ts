interface OpportunityDealTeamFieldData {
  emails: string[];
  first_name: string;
  id: number;
  last_name: string;
  type: number;
  primary_email: string;
}

export function getDealTeam(
  fields: {
    displayName: string;
    value: string | number | object | object[];
  }[],
): string[] {
  const dealLeads = (fields ?? []).find(
    (field) => field.displayName === 'Deal Team',
  )?.value as OpportunityDealTeamFieldData[];

  if (!dealLeads || dealLeads?.length === 0) {
    return [];
  }

  return dealLeads.map(
    (dealLeadValue) =>
      `${dealLeadValue?.first_name} ${dealLeadValue?.last_name}`,
  );
}
