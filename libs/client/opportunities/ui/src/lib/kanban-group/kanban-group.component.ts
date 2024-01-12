import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
  signal,
} from '@angular/core';
import { OnResizeDirective } from '@app/client/shared/ui-directives';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { ColumnData } from '../kanban-board/kanban-board.interface';
import { KanbanGroupHeaderComponent } from '../kanban-group-header/kanban-group-header.component';
import {
  OpportunitiesCardComponent,
  OpportunityCard,
} from '../opportunities-card/opportunities-card.component';

export type KanbanGroup = ColumnData; // TODO:

@Component({
  selector: 'app-kanban-group',
  standalone: true,
  imports: [
    KanbanGroupHeaderComponent,
    CdkDrag,
    CdkDropList,
    OpportunitiesCardComponent,
    LoaderModule,
    NgStyle,
    ScrollingModule,
    OnResizeDirective,
    NgClass,
    TitleCasePipe,
  ],
  templateUrl: './kanban-group.component.html',
  styleUrls: ['./kanban-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanGroupComponent {
  @ViewChildren(CdkDropList) public dropList: CdkDropList[];

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

  @Input() public group: KanbanGroup;

  protected expanded = signal(true);

  protected _draggingSelf = signal<OpportunityCard | null>(null);

  public setExpanded(value: boolean): void {
    this.expanded.set(value);
  }

  protected onDragStarted(item: OpportunityCard): void {
    this._draggingSelf.set(item);
    this.dragStarted.emit(item);
  }

  protected onDragEnded(item: OpportunityCard): void {
    this._draggingSelf.set(null);
    this.dragEnded.emit(item);
  }

  protected onExpandedChange($event: boolean): void {
    this.expanded.set($event);
  }

  protected drop($event: CdkDragDrop<OpportunityCard>): void {
    const opportunityId = $event.item.data.id;
    if (!this.group.cards?.some((c) => c.id === opportunityId)) {
      this.dropEvent.emit({
        opportunityId,
        pipelineStageId: this.group.id,
      });
    }
  }

  protected trackByFn(index: number, item: OpportunityCard): string {
    return item.id;
  }
}
