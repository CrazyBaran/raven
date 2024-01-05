import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { WebsocketEffects } from './lib/websocket.effects';

export * from './lib/websocket.service';

export const provideWebsocketEffects = (): Array<
  Provider | EnvironmentProviders
> => [importProvidersFrom(EffectsModule.forFeature(WebsocketEffects))];
