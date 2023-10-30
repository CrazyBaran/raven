import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TemplatesStoreFacade } from './+state/templates-store-facade.service';
import { TemplatesEffects } from './+state/templates.effects';
import {
  TEMPLATES_FEATURE_KEY,
  templatesReducer,
} from './+state/templates.reducer';
import { TemplateService } from './template.service';

export const templateFeatureProviders = [
  TemplateService,
  TemplatesStoreFacade,
  importProvidersFrom(
    StoreModule.forFeature(TEMPLATES_FEATURE_KEY, templatesReducer),
    EffectsModule.forFeature([TemplatesEffects]),
  ),
];
