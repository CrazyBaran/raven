import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as shortlistsEffects from './lib/+state/shortlists.effects';
import { shortlistsFeature } from './lib/+state/shortlists.reducer';

export * from './lib/+state/shortlists.actions';
export * from './lib/+state/shortlists.effects';
export * from './lib/+state/shortlists.model';
export * from './lib/+state/shortlists.selectors';

export const provideShortlistsFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature(shortlistsFeature),
    EffectsModule.forFeature(shortlistsEffects),
  ),
];
