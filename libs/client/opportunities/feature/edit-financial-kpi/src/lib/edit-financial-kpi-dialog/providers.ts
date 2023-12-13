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
import { EditFinancialKpiDialogComponent } from './edit-financial-kpi-dialog.component';

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
  imports: [EditFinancialKpiDialogComponent],
  exports: [EditFinancialKpiDialogComponent],
  providers: [createOpportunityDialogProviders],
})
export class EditFinancialKpiDialogModule implements DynamicModule {
  public entry = EditFinancialKpiDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
