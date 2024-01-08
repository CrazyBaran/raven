import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as OrganisationsEffects from './lib/+state/organisations.effects';
import { organisationsFeature } from './lib/+state/organisations.reducer';

export * from './lib/+state/organisations.actions';
export * from './lib/+state/organisations.model';
export * from './lib/+state/organisations.reducer';

export const provideOrganisationFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature(organisationsFeature),
    EffectsModule.forFeature([OrganisationsEffects]),
  ),
];
