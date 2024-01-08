import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PipelinesEffects } from './lib/+state/pipelines.effects';
import { pipelinesReducer } from './lib/+state/pipelines.reducer';

export * from './lib/+state/pipelines.actions';
export * from './lib/+state/pipelines.model';
export * from './lib/+state/pipelines.selectors';

export const providePipelinesFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature('pipelines', pipelinesReducer),
    EffectsModule.forFeature([PipelinesEffects]),
  ),
];
