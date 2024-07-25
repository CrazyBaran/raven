/* eslint-disable @typescript-eslint/member-ordering,@angular-eslint/no-input-rename */
import { CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewChildren,
  input,
} from '@angular/core';
import { RxVirtualScrollElementDirective } from '@rx-angular/template/experimental/virtual-scrolling';
import { DropAreaComponent } from '../drop-area/drop-area.component';
import { KanbanGroupHeaderComponent } from '../kanban-group-header/kanban-group-header.component';
import {
  KanbanGroup,
  KanbanGroupComponent,
} from '../kanban-group/kanban-group.component';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

export interface KanbanColumn {
  name: string;
  color: string;
  backgroundColor: string;
  groups: KanbanGroup[];
  flat?: boolean;
}

export interface KanbanDragStartEvent {
  card: OpportunityCard;
  from: string;
}

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [
    KanbanGroupComponent,
    KanbanGroupHeaderComponent,
    NgStyle,
    NgClass,
    ScrollingModule,
    CdkDropList,
    TitleCasePipe,
    DropAreaComponent,
    RxVirtualScrollElementDirective,
  ],
  templateUrl: './kanban-column.component.html',
  styleUrls: ['./kanban-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanColumnComponent {
  @ViewChildren(KanbanGroupComponent) public groups: KanbanGroupComponent[];

  @Input() public column: KanbanColumn;

  @Output() public dragStarted = new EventEmitter<KanbanDragStartEvent>();

  @Output() public dragEnded = new EventEmitter<OpportunityCard>();

  @Output() public dropEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  @ViewChild('container', { read: ElementRef }) protected container: ElementRef;

  public receiveMode = input(false);

  protected get length(): number {
    return this.column?.groups?.reduce((acc, group) => acc + group.length, 0);
  }

  protected isFlat(): boolean {
    return !!this.column?.flat;
  }

  protected drop(group: KanbanGroup, $event: { opportunityId: string }): void {
    const { opportunityId } = $event;
    if (!group.cards?.some((c) => c.id === opportunityId)) {
      this.dropEvent.emit({
        opportunityId,
        pipelineStageId: group.id,
      });
    }
  }

  protected onDragStarted($event: OpportunityCard, stageId: string): void {
    this.dragStarted.emit({
      card: $event,
      from: stageId,
    });
  }

  protected setExpanded($event: boolean): void {
    this.groups?.forEach((group) => group.setExpanded($event));
  }

  protected onExpandedChange(expanded: boolean): void {
    if (!expanded) {
      // force recalculation of virtual scroll
      setTimeout(() => {
        this.container?.nativeElement?.scrollTo({
          top: this.container.nativeElement.offsetTop - 77,
        });
      }, 5);
    }
  }
}
