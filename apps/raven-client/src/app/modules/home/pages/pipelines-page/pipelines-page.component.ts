import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  OpportunitiesActions,
  selectAllOpportunities,
  selectIsLoading as selectIsLoadingOpportunities,
} from '@app/rvnc-opportunities';
import {
  PipelinesActions,
  selectAllPipelines,
  selectIsLoading as selectIsLoadingPipelines,
} from '@app/rvnc-pipelines';
import { Store } from '@ngrx/store';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';

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
  public readonly isLoadingOpportunities$ = this.store.select(
    selectIsLoadingOpportunities,
  );
  public readonly opportunities$ = this.store.select(selectAllOpportunities);

  // Pipelines
  public readonly isLoadingPipelines$ = this.store.select(
    selectIsLoadingPipelines,
  );
  public readonly pipelines$ = this.store.select(selectAllPipelines);

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(
      OpportunitiesActions.getOpportunities({ take: 5000, skip: 0 }),
    );

    this.store.dispatch(PipelinesActions.getPipelines());
  }
}
