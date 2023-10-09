import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { OpportunitiesCardComponent } from '@app/rvnc-opportunities';
import { OpportunityData } from '@app/rvns-opportunities';
import { SortableModule } from '@progress/kendo-angular-sortable';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, SortableModule, OpportunitiesCardComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  @Input() public data: OpportunityData[] = [];

  public contactedData: number[] = [1, 2, 3, 4, 5, 6, 7];
  public metData: number[] = [8, 9, 10, 11, 12, 13, 14, 15];
  public ddData: number[] = [16, 17, 18];
  public socialisedData: number[] = [19, 20, 21, 22];

  public palettes = [
    {
      data: [],
      name: 'Contacted',
      fontColorClass: 'text-grey-500',
    },
    { data: [], name: 'Met', fontColorClass: 'text-info' },
    { data: [], name: 'DD', fontColorClass: 'text-success' },
    {
      data: [],
      name: 'Socialised',
      fontColorClass: 'text-warning',
    },
  ];

  public ngOnInit(): void {
    console.log('Ng_On_Init');
    console.log(this.data);

    const pipelineStageMap = this.data.map((item) => item.stage.displayName);

    console.log(pipelineStageMap);
  }
}
