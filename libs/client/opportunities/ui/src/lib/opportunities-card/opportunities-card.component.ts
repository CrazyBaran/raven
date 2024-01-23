import { CommonModule } from '@angular/common';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { AffinityUrlButtonComponent } from '../affinity-url-button/affinity-url-button.component';

export type OpportunityCard = {
  id: string;
  createdAt: string;
  organisation: {
    id: string;
    name: string;
    domains: string[];
  };
  additionalFields: {
    label: string;
    value: string | undefined;
  }[];
  dealLeads?: string[];
  affinityUrl?: string;
  height?: number;
};

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule, RouterLink, AffinityUrlButtonComponent, ButtonModule],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesCardComponent {
  @Input() public model: OpportunityCard;

  protected get additionalFields(): {
    label: string;
    value: string | undefined;
  }[] {
    return this.model.additionalFields.filter((field) => field.value?.trim());
  }
}

export const calculateOpportunityCardHeight = (
  item: OpportunityCard,
): number => {
  const margin = 16;
  const padding = 2 * 16;

  const header = 48 + 28;
  const createdAt = 28;

  const additionalFields = item.additionalFields.map((field) => field.value);

  const hasAdditionalFields = !!additionalFields.filter((x) => x?.trim())
    .length;

  const separator = hasAdditionalFields ? 24 : 0;

  const fieldHeight =
    additionalFields.filter((x) => x?.trim()).length * 24 +
    (item.dealLeads?.length ? 24 : 0);

  return margin + padding + header + createdAt + separator + fieldHeight;
};
