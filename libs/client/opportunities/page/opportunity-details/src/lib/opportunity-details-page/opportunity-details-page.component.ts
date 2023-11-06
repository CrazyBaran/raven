import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { JsonPipe } from '@angular/common';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { StatusIndicatorComponent } from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { RxFor } from '@rx-angular/template/for';
import { selectOpportunityDetailViewModel } from './opportunity-details-page.selectors';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ButtonsModule,
    StatusIndicatorComponent,
    RxFor,
    JsonPipe,
  ],
  templateUrl: './opportunity-details-page.component.html',
  styleUrls: ['./opportunity-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityDetailsPageComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityDetailViewModel);

  public constructor() {
    const opportunityId = this.vm().opportunityId;

    if (!opportunityId) {
      throw new Error(
        'Opportunity ID is required for Opportunity Details Page',
      );
    }

    this.store.dispatch(
      OpportunitiesActions.getOpportunityDetails({
        id: opportunityId,
      }),
    );

    const organizationId = this.vm().currentOrganisationId;

    if (!organizationId) {
      throw new Error(
        'Organization ID is required for Opportunity Details Page',
      );
    }

    this.store.dispatch(
      OrganisationsActions.getOrganisation({ id: organizationId }),
    );
  }
}
