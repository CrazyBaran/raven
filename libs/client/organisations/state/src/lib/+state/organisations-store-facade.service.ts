import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CreateOrganisation } from '@app/client/organisations/data-access';
import { OrganisationsActions } from './organisations.actions';
import { organisationsFeature } from './organisations.reducer';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsStoreFacade {
  public loaded = this.store.selectSignal(organisationsFeature.selectLoaded);

  public constructor(private store: Store) {}

  public init(): void {
    this.store.dispatch(OrganisationsActions.getOrganisations());
  }

  public createOrganisation(data: CreateOrganisation): void {
    this.store.dispatch(OrganisationsActions.createOrganisation({ data }));
  }
}
