import { Pipe, PipeTransform } from '@angular/core';

export interface OpportunityDealLeadFieldData {
  emails: string[];
  first_name: string;
  id: number;
  last_name: string;
  type: number;
  primary_email: string;
}

@Pipe({
  name: 'dealLeads',
  standalone: true,
})
export class DealLeadsPipe implements PipeTransform {
  public transform(
    fields: {
      displayName: string;
      value: string | number | object | object[];
    }[],
  ): string[] {
    return this.getDealLeads(fields);
  }

  private getDealLeads(
    fields: {
      displayName: string;
      value: string | number | object | object[];
    }[],
  ): string[] {
    const dealLeads = fields.find((field) => field.displayName === 'Deal Lead')
      ?.value as OpportunityDealLeadFieldData[];

    if (!dealLeads || dealLeads?.length === 0) {
      return [];
    }

    return dealLeads.map(
      (dealLeadValue) =>
        `${dealLeadValue?.first_name} ${dealLeadValue?.last_name}`,
    );
  }
}
