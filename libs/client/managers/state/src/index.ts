import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as managersEffects from './lib/+state/managers.effects';
import { managersFeature } from './lib/+state/managers.reducer';

export * from './lib/+state/managers.actions';
export * from './lib/+state/managers.effects';
export * from './lib/+state/managers.selectors';

export const provideManagersFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature(managersFeature),
    EffectsModule.forFeature(managersEffects),
  ),
];
