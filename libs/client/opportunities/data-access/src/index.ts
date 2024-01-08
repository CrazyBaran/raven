import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OpportunitiesEffects } from './lib/+state/opportunities.effects';
import { OpportunitiesFacade } from './lib/+state/opportunities.facade';
import { opportunitiesFeature } from './lib/+state/opportunities.reducer';

export * from './lib/+state/opportunities.actions';
export * from './lib/+state/opportunities.facade';
export * from './lib/+state/opportunities.reducer';
export * from './lib/+state/opportunities.selectors';
export * from './lib/services/opportunities.service';

export const provideOpportunitiesFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature(opportunitiesFeature),
    EffectsModule.forFeature([OpportunitiesEffects]),
  ),
  OpportunitiesFacade,
];
