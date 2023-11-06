import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';
import { OpportunityDealLeadFieldData } from '../opportunity-details/opportunitiy-details.interface';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
})
export class OpportunitiesCardComponent {
  @Input() public data: OpportunityData;

  public constructor(private readonly router: Router) {}

  public get dealLead(): string {
    const dealLeads = this.data.fields.find(
      (field) => field.displayName === 'Deal Lead',
    )?.value as OpportunityDealLeadFieldData[];

    if (!dealLeads || dealLeads?.length === 0) {
      return '';
    }

    return dealLeads
      .map(
        (dealLeadValue) =>
          `${dealLeadValue?.first_name} ${dealLeadValue?.last_name}`,
      )
      .join(', ');
  }

  public get dateAdded(): string {
    return '';
  }

  public handleGoToDetails(opportunityId: string): void {
    this.router.navigateByUrl(`/companies/opportunities/${opportunityId}`);
  }
}
