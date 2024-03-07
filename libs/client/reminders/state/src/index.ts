import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as remindersEffects from './lib/+state/reminders.effects';
import { remindersFeature } from './lib/+state/reminders.reducer';

export * from './lib/+state/reminders.actions';
export * from './lib/+state/reminders.effects';
export * from './lib/+state/reminders.model';
export * from './lib/+state/reminders.selectors';

export const provideRemindersFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  importProvidersFrom(
    StoreModule.forFeature(remindersFeature),
    EffectsModule.forFeature(remindersEffects),
  ),
];
