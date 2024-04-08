/* eslint-disable @typescript-eslint/member-ordering,@typescript-eslint/no-explicit-any */
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { isBoolean } from 'lodash';
import { Subject, delayWhen, filter } from 'rxjs';
import { DropAreaComponent } from '../drop-area/drop-area.component';
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
  preliminiaryColumn: KanbanColumn | null;
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

import * as _ from 'lodash';
import { DropConfirmationComponent } from '../drop-confirmation/drop-confirmation.component';
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
  @Output() public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  @Output() public removeCompanyFromShortlist = new EventEmitter<{
    organisationId: string;
  }>();

  public paramsEditId = signal<{
    opportunityId: string;
    organisationId: string;
    pipelineStageId?: string;
  } | null>(null);

  protected draggedCard = signal<OpportunityCard | null>(null);

  protected receiveMode = signal<KanbanDragStartEvent | null>(null);

  protected receiveMode$ = toObservable(this.receiveMode);

  protected destinationStageId = signal<string | null>(null);

  protected confirmDrop = signal<{
    footerGroup: KanbanFooterGroup;
    opportunityId: string;
  } | null>(null);

  private value$ = new Subject<KanbanBoard>();

  public constructor() {
    // wait for the receiveMode to be set to null before setting the board
    this.value$
      .pipe(
        takeUntilDestroyed(),
        delayWhen(() => this.receiveMode$.pipe(filter((mode) => !mode))),
      )
      .subscribe((board) => {
        this._board = board;
      });
  }

  private _board: KanbanBoard = {
    columns: [],
    footers: [],
    preliminiaryColumn: null,
  };

  public get board(): KanbanBoard {
    return this._board;
  }

  @Input() public set board(value: KanbanBoard) {
    this.value$.next(value);
  }

  public onOpportunityEditCancel(): void {
    this.paramsEditId.set(null);
    this.destinationStageId.set(null);
    this.receiveMode.set(null);
  }

  public onOpportunityEditSubmit(): void {
    this.paramsEditId.set(null);
    this.destinationStageId.set(null);
    this.receiveMode.set(null);
  }

  protected dragStarted($event: KanbanDragStartEvent): void {
    this.receiveMode.set($event);
    this.draggedCard.set($event.card);
  }

  protected dragEnded($event: OpportunityCard): void {
    this.receiveMode.set(null);
  }

  protected onFooterStageDrop(
    $event: { opportunityId: string },
    group: KanbanFooterGroup,
  ): void {
    this.receiveMode.set({} as any);
    this.confirmDrop.set({
      footerGroup: group,
      opportunityId: $event.opportunityId,
    });
  }

  protected onCloseDialog(): void {
    this.confirmDrop.set(null);
    this.receiveMode.set(null);
  }

  protected onConfirmDialog($event: {
    removeCompanyFromShortlist: boolean;
  }): void {
    this.dragEndEvent.emit({
      pipelineStageId: this.confirmDrop()!.footerGroup.id,
      opportunityId: this.confirmDrop()!.opportunityId,
    });
    if ($event.removeCompanyFromShortlist) {
      this.removeCompanyFromShortlist.emit({
        organisationId: _.chain(this._board.columns)
          .flatMap(({ groups }) => groups)
          .flatMap(({ cards }) => cards)
          .find({ id: this.confirmDrop()!.opportunityId })
          .value().organisation.id,
      });
    }
    this.confirmDrop.set(null);
    this.receiveMode.set(null);
  }

  protected onDrop(
    $event: {
      pipelineStageId: string;
      opportunityId: string;
    },
    columnIndex: number,
    column: KanbanColumn,
  ): void {
    const opportunity = _.chain(this._board.columns)
      .flatMap(({ groups }) => groups)
      .flatMap(({ cards }) => cards)
      .find({ id: $event.opportunityId })
      .value();
    const group = _.chain(this._board.columns)
      .flatMap(({ groups }) => groups)
      .value()
      .find((g) => g.cards?.includes(opportunity) ?? false);
    const originColumn = this._board.columns.find((c) =>
      c.groups.includes(group!),
    );

    if (
      !column!.name.includes('Outreach') &&
      !column!.name.includes('Met') &&
      !opportunity.created &&
      (originColumn!.name.includes('Outreach') ||
        originColumn!.name.includes('Met'))
    ) {
      this.receiveMode.set({} as any);
      this.paramsEditId.set({
        opportunityId: $event.opportunityId,
        organisationId: _.chain(this._board.columns)
          .flatMap(({ groups }) => groups)
          .flatMap(({ cards }) => cards)
          .find({ id: $event.opportunityId })
          .value().organisation.id,
        pipelineStageId: $event.pipelineStageId || undefined,
      });
      this.destinationStageId.set($event.pipelineStageId);
    } else {
      this.dragEndEvent.emit($event);
    }
  }
}
