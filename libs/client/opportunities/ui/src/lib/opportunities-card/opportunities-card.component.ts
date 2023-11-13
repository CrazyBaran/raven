import { CommonModule } from '@angular/common';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';
import { RxIf } from '@rx-angular/template/if';
import { OpportunityDealLeadFieldData } from '../opportunity-details/opportunitiy-details.interface';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RxIf],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesCardComponent {
  public dealLead = '';
  private _data: OpportunityData;

  public get data(): OpportunityData {
    return this._data;
  }

  @Input() public set data(value: OpportunityData) {
    this._data = value;
    this.dealLead = this.getDealLead();
  }

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
}
