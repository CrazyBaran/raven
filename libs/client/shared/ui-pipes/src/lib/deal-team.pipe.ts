import { Pipe, PipeTransform } from '@angular/core';

export interface OpportunityDealTeamFieldData {
  emails: string[];
  first_name: string;
  id: number;
  last_name: string;
  type: number;
  primary_email: string;
}

@Pipe({
  name: 'dealTeam',
  standalone: true,
})
export class DealTeamPipe implements PipeTransform {
  public transform(
    fields: {
      displayName: string;
      value: string | number | object | object[];
    }[],
  ): string[] {
    return this.getDealTeam(fields);
  }

  private getDealTeam(
    fields: {
      displayName: string;
      value: string | number | object | object[];
    }[],
  ): string[] {
    const dealLeads = fields.find((field) => field.displayName === 'Deal Team')
      ?.value as OpportunityDealTeamFieldData[];

    if (!dealLeads || dealLeads?.length === 0) {
      return [];
    }

    return dealLeads.map(
      (dealLeadValue) =>
        `${dealLeadValue?.first_name} ${dealLeadValue?.last_name}`,
    );
  }
}
