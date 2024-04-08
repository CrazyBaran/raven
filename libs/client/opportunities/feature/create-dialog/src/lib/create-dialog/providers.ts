import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideTagsFeature } from '@app/client/tags/state';
import { provideTemplatesFeature } from '@app/client/templates/data-access';
import { CreateDialogComponent } from './create-dialog.component';

@NgModule({
  imports: [CreateDialogComponent],
  exports: [CreateDialogComponent],
  providers: [
    provideOpportunitiesFeature(),
    provideTagsFeature(),
    provideTemplatesFeature(),
  ],
})
export class CreateOpportunityDialogModule implements DynamicModule {
  public entry = CreateDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
