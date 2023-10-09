import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OpportunityMockData } from './opportunities-card.interface';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
})
export class OpportunitiesCardComponent {
  @Input() public data: OpportunityMockData[] = [];
}
