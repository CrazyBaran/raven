/* eslint-disable @typescript-eslint/member-ordering */
import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
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
}

@Component({
  selector: 'app-kanban-column-container',
  standalone: true,
  imports: [
    KanbanGroupComponent,
    KanbanGroupHeaderComponent,
    NgStyle,
    KanbanColumnComponent,
  ],
  templateUrl: './kanban-column-container.component.html',
  styleUrls: ['./kanban-column-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanColumnContainerComponent {
  @ViewChildren(KanbanGroupComponent) public groups: KanbanGroupComponent[];

  @Input() public column: KanbanColumn;
  @Input() public receiveMode: boolean;

  @Output() public dragStarted = new EventEmitter<OpportunityCard>();
  @Output() public dragEnded = new EventEmitter<OpportunityCard>();

  protected setExpanded($event: boolean): void {
    this.groups?.forEach((group) => group.setExpanded($event));
  }
}
