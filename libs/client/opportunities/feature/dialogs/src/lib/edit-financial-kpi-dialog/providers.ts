import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { EditFinancialKpiDialogComponent } from './edit-financial-kpi-dialog.component';

@NgModule({
  imports: [EditFinancialKpiDialogComponent],
  exports: [EditFinancialKpiDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class EditFinancialKpiDialogModule implements DynamicModule {
  public entry = EditFinancialKpiDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
