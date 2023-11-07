import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
  OpportunitiesActions,
  OpportunitiesFacade,
} from '@app/client/opportunities/data-access';
import { KanbanBoardComponent } from '@app/client/opportunities/ui';
import {
  PipelinesActions,
  selectAllPipelines,
  selectIsLoading as selectIsLoadingPipelines,
} from '@app/client/pipelines';
import { Store } from '@ngrx/store';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-pipelines-page',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    KanbanBoardComponent,
    IndicatorsModule,
  ],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelinesPageComponent implements OnInit {
  // Opportunities
  public readonly isLoadingOpportunities$ = this.opportunitiesFacade.isLoading$;
  public readonly opportunities$ = this.opportunitiesFacade.opportunities$;

  // Pipelines
  public readonly isLoadingPipelines$ = this.store.select(
    selectIsLoadingPipelines,
  );
  public readonly pipelines$ = this.store.select(selectAllPipelines);

  public constructor(
    private readonly store: Store,
    private readonly opportunitiesFacade: OpportunitiesFacade,
    private readonly websocketService: WebsocketService,
  ) {}

  public ngOnInit(): void {
    this.opportunitiesFacade.getOpportunities(500, 0);

    this.store.dispatch(PipelinesActions.getPipelines());
    this.websocketService.connect();
    setTimeout(() => {
      this.websocketService.joinResourceEvents('pipelines');
    }, 2000);
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
