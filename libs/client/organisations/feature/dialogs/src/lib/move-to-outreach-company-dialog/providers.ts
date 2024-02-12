import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { MoveToOutreachCompanyDialogComponent } from './move-to-outreach-company-dialog.component';

@NgModule({
  imports: [MoveToOutreachCompanyDialogComponent],
  exports: [MoveToOutreachCompanyDialogComponent],
  providers: [provideOpportunitiesFeature(), provideTagsFeature()],
})
export class MoveToOutreachCompanyDialogModule implements DynamicModule {
  public entry = MoveToOutreachCompanyDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
