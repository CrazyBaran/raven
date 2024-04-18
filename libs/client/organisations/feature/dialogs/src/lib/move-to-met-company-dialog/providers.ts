import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { MoveToMetCompanyDialogComponent } from './move-to-met-company-dialog.component';

@NgModule({
  imports: [MoveToMetCompanyDialogComponent],
  exports: [MoveToMetCompanyDialogComponent],
  providers: [provideOpportunitiesFeature(), provideTagsFeature()],
})
export class MoveToMetCompanyDialogModule implements DynamicModule {
  public entry = MoveToMetCompanyDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
