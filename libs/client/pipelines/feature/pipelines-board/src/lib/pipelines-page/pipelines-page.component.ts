import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ENVIRONMENT } from '@app/client/core/environment';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { KanbanBoardComponent } from '@app/client/opportunities/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  selectKanbanBoard,
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
  ],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelinesPageComponent {
  public environment = inject(ENVIRONMENT);

  public vm = this.store.selectSignal(selectPipelinesPageViewModel);
  public board = this.store.selectSignal(
    selectKanbanBoard(this.environment.pipelineGrouping),
  );

  public constructor(private readonly store: Store) {
    this.store.dispatch(PipelinesActions.getPipelines());

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
}
