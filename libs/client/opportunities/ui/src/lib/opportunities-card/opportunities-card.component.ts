import { CommonModule } from '@angular/common';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';
import { OpportunityDealLeadFieldData } from '../opportunity-details/opportunitiy-details.interface';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesCardComponent {
  private _data: OpportunityData;

  @Input() public set data(value: OpportunityData) {
    this._data = value;
    this.dealLead = this.getDealLead();
  }

  public get data(): OpportunityData {
    return this._data;
  }

  public dealLead = '';

  public getDealLead(): string {
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
}
