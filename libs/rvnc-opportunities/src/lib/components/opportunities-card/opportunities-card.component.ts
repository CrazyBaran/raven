import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
})
export class OpportunitiesCardComponent implements OnInit {
  @Input() public data: OpportunityData;

  public constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    console.log(this.data);
  }

  public handleGoToDetails(opportunityId: string): void {
    this.router.navigateByUrl(`/opportunities/${opportunityId}`);

    console.log('Handle_Go_To_Details');
  }
}
