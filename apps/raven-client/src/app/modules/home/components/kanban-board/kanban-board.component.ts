import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { OpportunitiesCardComponent } from '@app/rvnc-opportunities';
import { OpportunityData } from '@app/rvns-opportunities';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { ColumnData } from './kanban-board.interface';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, SortableModule, OpportunitiesCardComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit, OnChanges {
  @Input({ required: true }) public opportunities: OpportunityData[] = [];
  @Input({ required: true }) public pipelines: PipelineDefinitionData[] = [];

  public contactedData: number[] = [1, 2, 3, 4, 5, 6, 7];
  public metData: number[] = [8, 9, 10, 11, 12, 13, 14, 15];
  public ddData: number[] = [16, 17, 18];
  public socialisedData: number[] = [19, 20, 21, 22];

  public kanbanColumns: ColumnData[] = [];

  public ngOnInit(): void {
    console.log('Ng_On_Init');
    console.log(this.opportunities);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.prepareKanbanData();
  }

  public prepareKanbanData(): void {
    if (this.opportunities && this.pipelines) {
      // Take stages from first pipeline
      const columns = this.pipelines[0].stages.map((item) => {
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
