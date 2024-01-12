/* eslint-disable @typescript-eslint/member-ordering */
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  DynamicSizeVirtualScrollStrategy,
  RxVirtualFor,
  RxVirtualScrollViewportComponent,
} from '@rx-angular/template/experimental/virtual-scrolling';
import { ColumnData } from '../kanban-board/kanban-board.interface';
import { KanbanGroupHeaderComponent } from '../kanban-group-header/kanban-group-header.component';
import {
  OpportunitiesCardComponent,
  OpportunityCard,
  calculateOpportunityCardHeight,
} from '../opportunities-card/opportunities-card.component';
export type KanbanGroup = ColumnData; // TODO:

@Component({
  selector: 'app-kanban-group',
  standalone: true,
  imports: [
    CommonModule,
    KanbanGroupHeaderComponent,
    CdkDrag,
    CdkDropList,
    OpportunitiesCardComponent,
    LoaderModule,
    RxVirtualFor,
    RxVirtualScrollViewportComponent,
    DynamicSizeVirtualScrollStrategy,
  ],
  templateUrl: './kanban-group.component.html',
  styleUrls: ['./kanban-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanGroupComponent {
  @ViewChild(DynamicSizeVirtualScrollStrategy)
  public scrollStrategy: DynamicSizeVirtualScrollStrategy<any>;

  private _group: KanbanGroup;

  @Input() public set group(value: KanbanGroup) {
    this._group = value;
    this.version++;
  }

  public get group(): KanbanGroup {
    return this._group;
  }

  @Input() public loading: boolean;

  @Input() public loadingMore: boolean;

  @Input() public color: string;

  @Input() public backgroundColor: string;

  @Input() public expandable: boolean;

  @Input() public withoutHeader: boolean;

  @Input() public withoutPadding: boolean;

  @Output() public dropEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  @Output() public dragStarted = new EventEmitter<OpportunityCard>();

  @Output() public dragEnded = new EventEmitter<OpportunityCard>();

  @Output() public expandedChange = new EventEmitter<boolean>();

  protected version = 1;

  protected expanded = signal(true);

  public setExpanded(value: boolean): void {
    this.expanded.set(value);
  }

  protected dynamicHeight: (item: OpportunityCard) => number = (item) => {
    return item.height ?? calculateOpportunityCardHeight(item);
  };

  protected onDragStarted(item: OpportunityCard): void {
    this.dragStarted.emit(item);
  }

  protected onDragEnded(item: OpportunityCard): void {
    this.dragEnded.emit(item);
  }

  protected onExpandedChange($event: boolean): void {
    this.expanded.set($event);
    this.expandedChange.emit($event);
  }
}
