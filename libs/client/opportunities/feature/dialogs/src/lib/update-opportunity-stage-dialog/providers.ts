import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { UpdateOpportunityStageDialogComponent } from './update-opportunity-stage-dialog.component';

@NgModule({
  imports: [UpdateOpportunityStageDialogComponent],
  exports: [UpdateOpportunityStageDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class UpdateOpportunityStageModule implements DynamicModule {
  public entry = UpdateOpportunityStageDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
