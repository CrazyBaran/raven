import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WebsocketService } from '@app/client/core/websockets';
import {
  OpportunitiesActions,
  OpportunitiesFacade,
} from '@app/client/opportunities/data-access';
import { KanbanBoardComponent } from '@app/client/opportunities/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { Store } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { distinctUntilChanged } from 'rxjs';
import {
  selectAllOpportunitiesDictionary,
  selectOportunitiesStageDictionary,
  selectPipelinesPageViewModel,
} from './pipelines-page.selectors';

@Component({
  selector: 'app-pipelines-page',
  standalone: true,
  imports: [
    CommonModule,
    KanbanBoardComponent,
    IndicatorsModule,
    PageTemplateComponent,
    TextBoxModule,
    ButtonModule,
    QuickFiltersTemplateComponent,
    ButtonGroupModule,
    RxFor,
    RouterLink,
    DropdownNavigationComponent,
    RxIf,
    ReactiveFormsModule,
    ButtongroupNavigationComponent,
    TextBoxNavigationComponent,
  ],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelinesPageComponent implements OnInit {
  public vm2 = this.store.selectSignal(selectPipelinesPageViewModel);

  public vm = computed(() => ({
    opportunitiesDictionary$: this.store.select(
      selectAllOpportunitiesDictionary,
    ),
    opportunitiesStageDictionary$: this.store.select(
      selectOportunitiesStageDictionary,
    ),
  }));

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

    this.websocketService
      .events()
      .pipe(distinctUntilChanged())
      .subscribe((event) => {
        if (event.eventType === 'pipeline-stage-changed') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { opportunityId, stageId } = event.data as any;
          this.store.dispatch(
            OpportunitiesActions.liveChangeOpportunityPipelineStage({
              id: opportunityId,
              pipelineStageId: stageId,
            }),
          );
        }
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

  public openOpportunityDialog(): void {
    this.store.dispatch(ShelfActions.openOpportunityForm());
  }
}
