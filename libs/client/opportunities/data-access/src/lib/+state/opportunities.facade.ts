//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OpportunitiesActions } from './opportunities.actions';
import { opportunitiesQuery } from './opportunities.selectors';

@Injectable()
export class OpportunitiesFacade {
  public opportunities$ = this.store.select(
    opportunitiesQuery.selectAllOpportunities,
  );
  public isLoading$ = this.store.select(opportunitiesQuery.selectIsLoading);
  public details$ = this.store.select(
    opportunitiesQuery.selectRouteOpportunityDetails,
  );

  public constructor(private store: Store) {}

  public getOpportunities(take: number, skip: number): void {
    this.store.dispatch(OpportunitiesActions.getOpportunities({ take, skip }));
  }

  public getOpportunityDetails(id: string): void {
    this.store.dispatch(OpportunitiesActions.getOpportunityDetails({ id }));
  }
}
