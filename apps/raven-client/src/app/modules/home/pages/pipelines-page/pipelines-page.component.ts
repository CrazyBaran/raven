import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OpportunitiesActions } from '@app/rvnc-opportunities';
import { Store } from '@ngrx/store';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';

@Component({
  selector: 'app-pipelines-page',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, KanbanBoardComponent],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
})
export class PipelinesPageComponent implements OnInit {
  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    console.log('Ng_On_Init');

    this.store.dispatch(OpportunitiesActions.getOpportunities());
  }
}
