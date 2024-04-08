import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { UpdateOpportunityDialogComponent } from './update-opportunity-dialog.component';

@NgModule({
  imports: [UpdateOpportunityDialogComponent],
  exports: [UpdateOpportunityDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class CreateOpportunityDialogModule implements DynamicModule {
  public entry = UpdateOpportunityDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
