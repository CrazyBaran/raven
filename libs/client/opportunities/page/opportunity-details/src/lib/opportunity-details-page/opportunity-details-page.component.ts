import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { JsonPipe, NgIf, NgStyle } from '@angular/common';
import { NotesActions } from '@app/client/notes/data-access';
import { NoteDetailsComponent } from '@app/client/notes/ui';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { StatusIndicatorComponent } from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { LoaderComponent } from '@app/client/shared/ui';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
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
    NgIf,
    NoteDetailsComponent,
    NgStyle,
    LoaderComponent,
    PageTemplateComponent,
    SkeletonModule,
    TimesPipe,
  ],
  templateUrl: './opportunity-details-page.component.html',
  styleUrls: ['./opportunity-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityDetailsPageComponent {
  protected store = inject(Store);
  protected router = inject(Router);

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
    this.store.dispatch(NotesActions.getOpportunityNotes({ opportunityId }));
  }

  public handleClosePreview(): void {
    this.router.navigate([], {
      queryParams: {
        noteId: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
