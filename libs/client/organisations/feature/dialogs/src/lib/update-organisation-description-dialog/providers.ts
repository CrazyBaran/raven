import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOrganisationFeature } from '@app/client/organisations/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { UpdateOrganisationDescriptionDialogComponent } from './update-organisation-description-dialog.component';

@NgModule({
  imports: [UpdateOrganisationDescriptionDialogComponent],
  exports: [UpdateOrganisationDescriptionDialogComponent],
  providers: [provideTagsFeature(), provideOrganisationFeature()],
})
export class UpdateOrganisationDescriptionModule implements DynamicModule {
  public entry = UpdateOrganisationDescriptionDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
