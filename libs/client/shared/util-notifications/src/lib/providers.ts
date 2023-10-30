import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import * as NotificationsEffects from './notifications.effects';

export const provideNotifications = (): [EnvironmentProviders] => [
  importProvidersFrom(EffectsModule.forFeature([NotificationsEffects])),
];
