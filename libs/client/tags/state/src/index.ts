import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TagsStoreFacade } from './lib/+state/tags-store-facade.service';
import * as tagsEffects from './lib/+state/tags.effects';
import { tagsFeature } from './lib/+state/tags.reducer';

export * from './lib/+state/tags-store-facade.service';
export * from './lib/+state/tags.actions';
export * from './lib/+state/tags.model';
export * from './lib/+state/tags.reducer';
export * from './lib/+state/tags.selectors';

export const provideTagsFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  TagsStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(tagsFeature),
    EffectsModule.forFeature(tagsEffects),
  ),
];
