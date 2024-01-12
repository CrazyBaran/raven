import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { DropAreaComponent } from '../drop-area/drop-area.component';
import {
  KanbanColumn,
  KanbanColumnComponent,
} from '../kanban-column/kanban-column.component';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

export interface KanbanBoard {
  columns: KanbanColumn[];
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    KanbanColumnComponent,
    CdkDropListGroup,
    CdkScrollable,
    DropAreaComponent,
    NgClass,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  @Output() public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  @Input() public board: KanbanBoard;

  protected receiveMode = signal(false);

  protected showFooterAreas = signal(false);

  protected dragStarted($event: OpportunityCard): void {
    this.receiveMode.set(true);

    setTimeout(() => {
      this.showFooterAreas.set(true);
    }, 505);
  }

  protected dragEnded($event: OpportunityCard): void {
    this.receiveMode.set(false);
    this.showFooterAreas.set(false);
  }
}
