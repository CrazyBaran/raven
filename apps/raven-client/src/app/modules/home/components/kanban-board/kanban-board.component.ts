import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OpportunitiesCardComponent } from '@app/rvnc-opportunities';
import { SortableModule } from '@progress/kendo-angular-sortable';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, SortableModule, OpportunitiesCardComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  public contactedData: number[] = [1, 2, 3, 4, 5, 6, 7];
  public metData: number[] = [8, 9, 10, 11, 12, 13, 14, 15];
  public ddData: number[] = [16, 17, 18];
  public socialisedData: number[] = [19, 20, 21, 22];

  public palettes = [
    {
      data: this.contactedData,
      name: 'Contacted',
      fontColorClass: 'text-grey-500',
    },
    { data: this.metData, name: 'Met', fontColorClass: 'text-info' },
    { data: this.ddData, name: 'DD', fontColorClass: 'text-success' },
    {
      data: this.socialisedData,
      name: 'Socialised',
      fontColorClass: 'text-warning',
    },
  ];
}
