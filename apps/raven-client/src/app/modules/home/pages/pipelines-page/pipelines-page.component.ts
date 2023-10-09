import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  OpportunitiesActions,
  selectAllOpportunities,
  selectIsLoading,
} from '@app/rvnc-opportunities';
import { Store } from '@ngrx/store';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { Subject, takeUntil } from 'rxjs';
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
export class PipelinesPageComponent implements OnInit, OnDestroy {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly pipelines$ = this.store.select(selectAllOpportunities);

  public ngUnsubscribe$ = new Subject<void>();

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.pipelines$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      console.log('Pipelines Data');
      console.log(data);
    });
    this.store.dispatch(
      OpportunitiesActions.getOpportunities({ take: 100, skip: 0 }),
    );
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
