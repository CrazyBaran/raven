import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideManagersFeature } from '@app/client/managers/state';
import { UpdateContactDialogComponent } from './update-contact-dialog.component';

@NgModule({
  imports: [UpdateContactDialogComponent],
  exports: [UpdateContactDialogComponent],
  providers: [provideManagersFeature()],
})
export class UpdateContactDialogModule implements DynamicModule {
  public entry = UpdateContactDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
