import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TemplatesStoreFacade } from './lib/+state/templates-store-facade.service';
import { TemplatesEffects } from './lib/+state/templates.effects';
import {
  TEMPLATES_FEATURE_KEY,
  templatesReducer,
} from './lib/+state/templates.reducer';
import { TemplateService } from './lib/template.service';

export * from './lib/+state/templates-store-facade.service';
export * from './lib/+state/templates.actions';
export * from './lib/+state/templates.selectors';

export const provideTemplatesFeature = (): Array<
  Provider | EnvironmentProviders
> => [
  TemplateService,
  TemplatesStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(TEMPLATES_FEATURE_KEY, templatesReducer),
    EffectsModule.forFeature([TemplatesEffects]),
  ),
];
