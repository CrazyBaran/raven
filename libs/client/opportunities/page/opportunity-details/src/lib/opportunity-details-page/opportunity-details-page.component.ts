import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { trigger } from '@angular/animations';
import { JsonPipe, NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NotesActions } from '@app/client/opportunities/api-notes';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import {
  AffinityUrlButtonComponent,
  DropConfirmationComponent,
  KanbanFooterGroup,
  StatusIndicatorComponent,
} from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { PipelinesActions } from '@app/client/pipelines/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { FadeInOutDirective, fadeIn } from '@app/client/shared/ui';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownAction,
  DropdownButtonNavigationComponent,
} from '@app/client/shared/ui-router';
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
    DropConfirmationComponent,
    ReactiveFormsModule,
    DropdownButtonNavigationComponent,
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

  protected footerGroup = signal<KanbanFooterGroup | null>(null);
  protected pipelineStageFormControl = new FormControl<string | null>(null);

  protected dropdownButtonActions = {
    actions: [
      {
        text: 'Reopen Opportunity',
        queryParamsHandling: 'merge',
        routerLink: ['./'],
        queryParams: {
          [DialogQueryParams.reopenOpportunity]: this.vm().opportunityId!,
        },
        skipLocationChange: true,
      } as DropdownAction,
    ],
  };

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

  public onStageChange(stageId: string): void {
    const stage = this.vm().lines.data.find((s) => s.id === stageId);
    if (stage && stage.configuration) {
      this.footerGroup.set({
        id: stageId,
        name: stage.displayName,
        theme: stage.configuration.color as 'success' | 'warning',
        droppableFrom: stage.configuration.droppableFrom,
      });
    } else {
      this.store.dispatch(
        OpportunitiesActions.changeOpportunityPipelineStage({
          id: this.vm().opportunityId!,
          pipelineStageId: stageId,
        }),
      );
    }
  }

  protected onCloseDialog(): void {
    this.pipelineStageFormControl.setValue(this.vm().lines.value ?? null, {
      emitEvent: false,
    });
    this.footerGroup.set(null);
  }

  protected onConfirmDialog(): void {
    this.store.dispatch(
      OpportunitiesActions.changeOpportunityPipelineStage({
        id: this.vm().opportunityId!,
        pipelineStageId: this.footerGroup()!.id,
      }),
    );
    this.footerGroup.set(null);
  }
}
