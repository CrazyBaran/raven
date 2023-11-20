//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OpportunitiesActions } from './opportunities.actions';

@Injectable()
export class OpportunitiesFacade {
  public constructor(private store: Store) {}

  public getOpportunities(take: number, skip: number): void {
    this.store.dispatch(OpportunitiesActions.getOpportunities({ take, skip }));
  }

  public getOpportunityDetails(id: string): void {
    this.store.dispatch(OpportunitiesActions.getOpportunityDetails({ id }));
  }
}
