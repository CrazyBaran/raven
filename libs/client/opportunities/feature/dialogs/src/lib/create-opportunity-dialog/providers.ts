import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { CreateOpportunityDialogComponent } from './create-opportunity-dialog.component';

@NgModule({
  imports: [CreateOpportunityDialogComponent],
  exports: [CreateOpportunityDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class CreateOpportunityDialogModule implements DynamicModule {
  public entry = CreateOpportunityDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
