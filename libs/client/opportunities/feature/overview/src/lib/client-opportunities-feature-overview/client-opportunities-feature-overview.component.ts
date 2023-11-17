import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';

export const SelectOpportunityOverviewViewModel = createSelector(
  getRouterSelectors().selectQueryParams,
  opportunitiesQuery.selectRouteOpportunityDetails,
  (params, opportunity) => {
    return {
      details: [
        {
          label: 'Curvestone',
          subLabel: 'Curvestone.io',
        },
        {
          label: 'Series B',
          subLabel: 'Opportunity',
        },
        {
          label: '$50m',
          subLabel: 'Round Size',
        },
        {
          label: '$1bn',
          subLabel: 'Valuation',
        },
        {
          label: '$20m',
          subLabel: 'Proposed Investment',
        },
        {
          label: 'Lead',
          subLabel: 'Positioning',
        },
        {
          label: 'Q2, 2024',
          subLabel: 'Timing',
        },
      ],
      team: [
        {
          dealLead: {
            name: 'John Doe',
          },
          dealTeam: [
            {
              name: 'John Doe',
            },
            {
              name: 'Jack Ma',
            },
            {
              name: 'Mark Zuckerberg',
            },
          ],
        },
      ],
      missingDetails: [
        {
          tab: 'Team',
          field: 'Risks',
          action: 'Please fill field to advance',
        },
        {
          tab: 'Product & Technology',
          field: 'Positives',
          action: 'Please fill field to advance',
        },
        {
          tab: 'Financials',
          field: 'Key Financial to Save',
          action: 'Please fill this table in entirety to advance',
        },
      ],
    };
  },
);

@Component({
  selector: 'app-client-opportunities-feature-overview',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    ButtonModule,
    RxFor,
    GridModule,
    TagComponent,
    UserTagDirective,
  ],
  templateUrl: './client-opportunities-feature-overview.component.html',
  styleUrls: ['./client-opportunities-feature-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureOverviewComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(SelectOpportunityOverviewViewModel);
}
