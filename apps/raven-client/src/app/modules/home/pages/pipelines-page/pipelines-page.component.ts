import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { OpportunitiesFacade } from '@app/rvnc-opportunities/data-access';
import { KanbanBoardComponent } from '@app/rvnc-opportunities/ui';
import {
  PipelinesActions,
  selectAllPipelines,
  selectIsLoading as selectIsLoadingPipelines,
} from '@app/rvnc-pipelines';
import { Store } from '@ngrx/store';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';

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
  ) {}

  public ngOnInit(): void {
    this.opportunitiesFacade.getOpportunities(500, 0);

    this.store.dispatch(PipelinesActions.getPipelines());
  }
}
