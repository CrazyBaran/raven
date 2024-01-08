import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { trigger } from '@angular/animations';
import { JsonPipe, NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotesActions } from '@app/client/notes/state';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import {
  AffinityUrlButtonComponent,
  StatusIndicatorComponent,
} from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { PipelinesActions } from '@app/client/pipelines/state';
import { FadeInOutDirective, fadeIn } from '@app/client/shared/ui';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { selectOpportunityDetailViewModel } from './opportunity-details-page.selectors';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ButtonsModule,
    StatusIndicatorComponent,
    JsonPipe,
    NgStyle,
    PageTemplateComponent,
    SkeletonModule,
    TimesPipe,
    FadeInOutDirective,
    DropDownsModule,
    AffinityUrlButtonComponent,
  ],
  templateUrl: './opportunity-details-page.component.html',
  styleUrls: ['./opportunity-details-page.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityDetailsPageComponent {
  protected store = inject(Store);
  protected router = inject(Router);
  protected actions = inject(Actions);

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
    this.store.dispatch(PipelinesActions.getPipelines());

    this.actions
      .pipe(
        takeUntilDestroyed(),
        ofType(OpportunitiesActions.changeOpportunityPipelineStageSuccess),
      )
      .subscribe((action) => {
        this.store.dispatch(
          OpportunitiesActions.getOpportunityDetails({
            id: opportunityId,
          }),
        );
      });
  }

  public handleClosePreview(): void {
    this.router.navigate([], {
      queryParams: {
        noteId: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  public onStageChange(stageId: string): void {
    this.store.dispatch(
      OpportunitiesActions.changeOpportunityPipelineStage({
        id: this.vm().opportunityId!,
        pipelineStageId: stageId,
      }),
    );
  }
}
