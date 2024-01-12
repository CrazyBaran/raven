/* eslint-disable @typescript-eslint/member-ordering,@angular-eslint/no-input-rename */
import { state } from '@angular/animations';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewChildren,
  signal,
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
export class KanbanColumnComponent implements AfterViewInit {
  @ViewChildren(KanbanGroupComponent) public groups: KanbanGroupComponent[];

  @Input() public column: KanbanColumn;

  @Output() public dragStarted = new EventEmitter<OpportunityCard>();

  @Output() public dragEnded = new EventEmitter<OpportunityCard>();

  @Output() public dropEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  protected scrollSnapshot: number;

  @ViewChild('container', { read: ElementRef }) protected container: ElementRef;

  protected receiveMode = signal(false);

  @Input('receiveMode') public set _receiveMode(value: boolean) {
    if (value) {
      this.scrollSnapshot = this.container.nativeElement?.scrollTop ?? 0;
    } else {
      if (this.container?.nativeElement) {
        setTimeout(() => {
          this.container.nativeElement.scrollTop = this.scrollSnapshot;
        }, 5);
      }
    }

    this.receiveMode.set(value);
  }

  protected get length(): number {
    return this.column?.groups?.reduce((acc, group) => acc + group.length, 0);
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

  public ngAfterViewInit(): void {
    this.groups?.forEach((group) => {
      group.setExpanded(true);
    });
  }

  protected setExpanded($event: boolean): void {
    this.groups?.forEach((group) => group.setExpanded($event));
  }

  protected readonly state = state;
}
