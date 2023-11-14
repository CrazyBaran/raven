import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WebsocketService } from '@app/client/core/websockets';
import {
  OpportunitiesActions,
  OpportunitiesFacade,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import {
  KanbanBoardComponent,
  OpportunityDetails,
} from '@app/client/opportunities/ui';
import {
  PipelinesActions,
  pipelinesQuery,
  selectAllPipelines,
} from '@app/client/pipelines/state';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  DropdownNavigationComponent,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { routerQuery } from '@app/client/shared/util-router';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector, Store } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export const selectPipelineBoardNavigationFilters = createSelector(
  routerQuery.selectActiveLine,
  () => [
    {
      id: null,
      name: 'All deals',
      selected: true,
    },
    {
      id: null,
      name: 'My deals',
      selected: false,
    },
  ],
);

export const selectPipelineBoardNavigationDropdowns = createSelector(
  routerQuery.selectActiveLine,
  (): DropdownNavigationModel[] => [
    {
      queryParamName: 'stage',
      data: [],
      defaultItem: {
        name: 'All stages',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'dealLead',
      data: [],
      defaultItem: {
        name: 'Deal Lead',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'geography',
      data: [],
      defaultItem: {
        name: 'Geography',
        id: null,
      },
      value: null,
      loading: false,
    },
  ],
);

export const selectAllOpportunitiesDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  (opportunities) =>
    _.chain(opportunities)
      .map(
        (o): OpportunityDetails => ({
          id: o.id,
          fields: o.fields,
          organisation: o.organisation,
        }),
      )
      .keyBy((o) => o.id)
      .value(),
);
export const selectIsLoadingPipelineBoard = createSelector(
  pipelinesQuery.selectIsLoading,
  opportunitiesQuery.selectIsLoading,
  (pipelines, opportunities) => pipelines || opportunities,
);

export const selectOportunitiesStageDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  (opportunities) =>
    _.chain(opportunities)
      .groupBy((o) => o.stage.id)
      .mapValues((opportunities) => opportunities.map(({ id }) => id))
      .value(),
);

export const selectPipelinesPageViewModel = createSelector(
  selectAllOpportunitiesDictionary,
  selectOportunitiesStageDictionary,
  selectAllPipelines,
  selectIsLoadingPipelineBoard,
  selectPipelineBoardNavigationDropdowns,
  selectPipelineBoardNavigationFilters,
  getRouterSelectors().selectQueryParam('pipelineQuery'),
  (
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    filters,
    pipelineQuery,
  ) => ({
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    filters,
    pipelineQuery,
  }),
);

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

  public searchPipelinesForm = new FormControl(this.vm2().pipelineQuery);

  public constructor(
    private readonly store: Store,
    private readonly opportunitiesFacade: OpportunitiesFacade,
    private readonly websocketService: WebsocketService,
    private readonly router: Router,
    private readonly activedRoute: ActivatedRoute,
  ) {
    this.searchPipelinesForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.router.navigate([], {
          relativeTo: this.activedRoute,
          queryParams: { pipelineQuery: value ?? null },
          queryParamsHandling: 'merge',
        });
      });
  }

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
