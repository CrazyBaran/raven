import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { OpportunityData } from '@app/rvns-opportunities';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { OpportunitiesCardComponent } from '../opportunities-card/opportunities-card.component';
import { ColumnData } from './kanban-board.interface';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, SortableModule, OpportunitiesCardComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnChanges {
  @Input({ required: true }) public opportunities: OpportunityData[] = [];
  @Input({ required: true }) public pipelines: PipelineDefinitionData[] = [];

  public kanbanColumns: ColumnData[] = [];

  public ngOnChanges(): void {
    this.prepareKanbanData();
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
}
