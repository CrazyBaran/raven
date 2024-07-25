import { ChangeDetectionStrategy, Component } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { CreateOpportunityOnStageDialogComponent } from '@app/client/opportunities/feature/dialogs';
import { PipelinesActions } from '@app/client/pipelines/state';
import { KanbanBoardComponent } from '@app/client/pipelines/ui';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  selectKanbanBoardByConfig,
  selectPipelineBoardParams,
  selectPipelinesPageViewModel,
} from './pipelines-page.selectors';

@Component({
  selector: 'app-pipelines-page',
  standalone: true,
  imports: [
    PageTemplateComponent,
    TextBoxNavigationComponent,
    QuickFiltersTemplateComponent,
    ButtongroupNavigationComponent,
    LoaderModule,
    KanbanBoardComponent,
    DropdownNavigationComponent,
    CreateOpportunityOnStageDialogComponent,
  ],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelinesPageComponent {
  public vm = this.store.selectSignal(selectPipelinesPageViewModel);
  public boardModel = this.store.selectSignal(selectKanbanBoardByConfig);

  public constructor(private readonly store: Store) {
    this.store.dispatch(PipelinesActions.getPipelines());
    this.store.dispatch(ShortlistsActions.getShortlistExtras());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['people', 'opportunity'],
      }),
    );

    this.store
      .select(selectPipelineBoardParams)
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.store.dispatch(OpportunitiesActions.getOpportunities({ params }));
      });
  }

  public onDragEvent($event: {
    pipelineStageId: string;
    opportunityId: string;
  }): void {
    this.store.dispatch(
      OpportunitiesActions.changeOpportunityPipelineStage({
        id: $event.opportunityId,
        pipelineStageId: $event.pipelineStageId,
      }),
    );
  }

  public removeCompanyFromShortlist($event: { organisationId: string }): void {
    this.store.dispatch(
      ShortlistsActions.removeOrganisationFromMyShortlist({
        organisationId: $event.organisationId,
      }),
    );
  }
}
