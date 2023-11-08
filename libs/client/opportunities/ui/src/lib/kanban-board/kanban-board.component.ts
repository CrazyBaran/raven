import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { OpportunityData } from '@app/rvns-opportunities';
import { PipelineDefinitionData } from '@app/rvns-pipelines';

import { RxFor } from '@rx-angular/template/for';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';
import { RxIf } from '@rx-angular/template/if';
import { Subject, map, merge } from 'rxjs';
import { OpportunitiesCardComponent } from '../opportunities-card/opportunities-card.component';
import { ColumnData } from './kanban-board.interface';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    OpportunitiesCardComponent,
    RxFor,
    RxIf,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements OnChanges {
  @Input({ required: true }) public opportunities: OpportunityData[] = [];
  @Input({ required: true }) public pipelines: PipelineDefinitionData[] = [];

  @Output() public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  public kanbanColumns: ColumnData[] = [];

  public ngOnChanges(): void {
    this.prepareKanbanData();
  }

  public constructor() {
    this.startRender.next();
  }

  public prepareKanbanData(): void {
    if (this.opportunities && this.pipelines) {
      // Take stages from first pipeline
      const columns = (this.pipelines[0]?.stages || []).map((item) => {
        return {
          name: item.displayName,
          id: item.id,
          data: this.opportunities.filter(
            (opportunity) => opportunity.stage.id === item.id,
          ),
        };
      });

      this.kanbanColumns = columns;
    }
  }

  public drop(event: CdkDragDrop<ColumnData>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const opportunityId = event.item.data.id;
      const pipelineStageId = event.container.data.id;
      this.dragEndEvent.emit({ pipelineStageId, opportunityId });

      transferArrayItem(
        event.previousContainer.data.data,
        event.container.data.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public trackBy = (index: number, item: OpportunityData): string => item.id;

  protected itemsRendered = new Subject<any[]>();
  protected startRender = new Subject<void>();

  protected visible = toSignal(
    merge(
      this.startRender.pipe(map(() => false)),
      this.itemsRendered.pipe(map(() => true)),
    ),
  );
}
