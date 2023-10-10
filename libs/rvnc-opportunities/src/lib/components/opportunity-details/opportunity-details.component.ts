import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { OpportunitiesActions } from '../../+state/opportunities.actions';
import { selectIsLoading } from '../../+state/opportunities.selectors';

@Component({
  selector: 'app-opportunity-details',
  standalone: true,
  imports: [CommonModule, IndicatorsModule],
  templateUrl: './opportunity-details.component.html',
  styleUrls: ['./opportunity-details.component.scss'],
})
export class OpportunityDetailsComponent implements OnInit, OnDestroy {
  public readonly isLoading$ = this.store.select(selectIsLoading);

  public constructor(
    public readonly store: Store,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      if (id) {
        this.store.dispatch(OpportunitiesActions.getOpportunityDetails({ id }));
      }
    });
  }

  public ngOnDestroy(): void {
    this.store.dispatch(OpportunitiesActions.clearOpportunityDetails());
  }
}
