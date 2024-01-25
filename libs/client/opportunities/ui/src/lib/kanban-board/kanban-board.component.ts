/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';

import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/overlay';
import { LowerCasePipe, NgClass } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { isBoolean } from 'lodash';
import { delayWhen, filter, of } from 'rxjs';
import { DropAreaComponent } from '../drop-area/drop-area.component';
import { DropConfirmationComponent } from '../drop-confirmation/drop-confirmation.component';
import {
  KanbanColumn,
  KanbanColumnComponent,
  KanbanDragStartEvent,
} from '../kanban-column/kanban-column.component';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

export interface KanbanFooterGroup {
  name: string;
  id: string;
  theme: 'warning' | 'success';
  reminder?: boolean;
  removeSwitch?: boolean;
  droppableFrom: string[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  footers: KanbanFooterGroup[];
}

@Pipe({
  name: 'disabledFooterGroup',
  standalone: true,
})
export class DisabledFooterGroupPipe implements PipeTransform {
  public transform(
    value: KanbanFooterGroup,
    receiveMode: KanbanDragStartEvent | boolean | null,
  ): boolean {
    if (!receiveMode || isBoolean(receiveMode)) {
      return false;
    }
    return !value.droppableFrom.includes(receiveMode.from);
  }
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
    DisabledFooterGroupPipe,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  private _board: KanbanBoard = {
    columns: [],
    footers: [],
  };

  @Input() public set board(value: KanbanBoard) {
    // wait for the receiveMode to be set to null before setting the board
    of(value)
      .pipe(
        delayWhen(() =>
          this.receiveMode$.pipe(filter((mode) => mode === null)),
        ),
      )
      .subscribe((board) => {
        this._board = board;
      });
  }

  public get board(): KanbanBoard {
    return this._board;
  }

  @Output() public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  protected receiveMode = signal<KanbanDragStartEvent | boolean | null>(null);
  protected receiveMode$ = toObservable(this.receiveMode);

  protected confirmDrop = signal<{
    footerGroup: KanbanFooterGroup;
    opportunityId: string;
  } | null>(null);

  protected dragStarted($event: KanbanDragStartEvent): void {
    this.receiveMode.set($event);
  }

  protected dragEnded($event: OpportunityCard): void {
    this.receiveMode.set(null);
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
    this.dragEndEvent.emit({
      pipelineStageId: this.confirmDrop()!.footerGroup.id,
      opportunityId: this.confirmDrop()!.opportunityId,
    });
    this.confirmDrop.set(null);
    this.receiveMode.set(false);
  }
}
