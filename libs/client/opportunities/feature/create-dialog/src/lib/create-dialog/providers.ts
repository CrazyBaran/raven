import { importProvidersFrom, NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  OpportunitiesEffects,
  opportunitiesFeature,
} from '@app/client/opportunities/data-access';
import { tagsEffects, tagsFeature } from '@app/client/tags/state';
import { templateFeatureProviders } from '@app/client/templates/data-access';
import { CreateDialogComponent } from './create-dialog.component';

export const createOpportunityDialogProviders = [
  importProvidersFrom(
    StoreModule.forFeature(opportunitiesFeature),
    EffectsModule.forFeature([OpportunitiesEffects]),
    StoreModule.forFeature(tagsFeature),
    EffectsModule.forFeature([tagsEffects]),
  ),
  templateFeatureProviders,
];

@NgModule({
  imports: [CreateDialogComponent],
  exports: [CreateDialogComponent],
  providers: [createOpportunityDialogProviders],
})
export class CreateOpportunityDialogModule implements DynamicModule {
  public entry = CreateDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
