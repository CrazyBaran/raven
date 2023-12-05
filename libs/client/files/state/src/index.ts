import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as filesEffects from './lib/+state/files.effects';
import { filesFeature } from './lib/+state/files.reducer';

export * from './lib/+state/files.actions';
export * from './lib/+state/files.reducer';
export * from './lib/+state/files.selectors';

export const provideFileFeature = [
  importProvidersFrom(
    StoreModule.forFeature(filesFeature),
    EffectsModule.forFeature([filesEffects]),
  ),
];
