import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';

import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { DialogResult, DialogService } from '@progress/kendo-angular-dialog';
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
  public dialogService = inject(DialogService);

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

  protected onFooterStageDrop($event: { opportunityId: string }): void {
    this.receiveMode.set(true);
    this.dialogService
      .open({
        title: 'Do you want to drop opportunity to this stage?',
        width: 400,
        content: 'Are you sure you want to continue?',
        actions: [
          { text: 'No' },
          {
            text: 'Yes, leave without publishing',
            primary: true,
            themeColor: 'primary',
          },
        ],
      })
      .result.subscribe((res: DialogResult) => {
        this.receiveMode.set(false);
        if ('text' in res && res.text === 'Yes, leave without publishing') {
        }
      });
  }
}
