import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { ReopenOpportunityDialogComponent } from './reopen-opportunity-dialog.component';

@NgModule({
  imports: [ReopenOpportunityDialogComponent],
  exports: [ReopenOpportunityDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class ReopenOpportunityDialogModule implements DynamicModule {
  public entry = ReopenOpportunityDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
