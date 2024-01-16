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
import { LowerCasePipe, NgClass } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { lowerCase } from 'lodash';
import { DropAreaComponent } from '../drop-area/drop-area.component';
import { DropConfirmationComponent } from '../drop-confirmation/drop-confirmation.component';
import {
  KanbanColumn,
  KanbanColumnComponent,
} from '../kanban-column/kanban-column.component';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

export interface KanbanFooterGroup {
  name: string;
  id: string;
  theme: 'warning' | 'success';
  reminder: boolean;
  removeSwitch: boolean;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  footers: KanbanFooterGroup[];
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
    DialogModule,
    ButtonModule,
    InputsModule,
    LowerCasePipe,
    DropConfirmationComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  @Input() public board: KanbanBoard;

  @Output() public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  protected receiveMode = signal(false);

  protected confirmDrop = signal<{
    footerGroup: KanbanFooterGroup;
    opportunityId: string;
  } | null>(null);

  protected dragStarted($event: OpportunityCard): void {
    this.receiveMode.set(true);
  }

  protected dragEnded($event: OpportunityCard): void {
    this.receiveMode.set(false);
  }

  protected onFooterStageDrop(
    $event: { opportunityId: string },
    group: KanbanFooterGroup,
  ): void {
    this.receiveMode.set(true);
    this.confirmDrop.set({
      footerGroup: group,
      opportunityId: $event.opportunityId,
    });
  }

  protected onCloseDialog(): void {
    this.confirmDrop.set(null);
    this.receiveMode.set(false);
  }

  protected onConfirmDialog(): void {
    // this.dragEndEvent.emit(this.confirmDrop()!);
    this.confirmDrop.set(null);
    this.receiveMode.set(false);
  }

  protected readonly lowerCase = lowerCase;
}
