import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { PassCompanyDialogComponent } from './pass-company-dialog.component';

@NgModule({
  imports: [PassCompanyDialogComponent],
  exports: [PassCompanyDialogComponent],
  providers: [provideOpportunitiesFeature()],
})
export class PassCompanyDialogModule implements DynamicModule {
  public entry = PassCompanyDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
