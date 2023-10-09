import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
})
export class OpportunitiesCardComponent {
  @Input() public data: OpportunityData;

  public constructor(private readonly router: Router) {}

  public handleGoToDetails(opportunityId: string): void {
    this.router.navigateByUrl(`/opportunities/${opportunityId}`);
  }
}
