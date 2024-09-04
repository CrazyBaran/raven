import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideManagersFeature } from '@app/client/managers/state';
import { CreateContactDialogComponent } from './create-contact-dialog.component';

@NgModule({
  imports: [CreateContactDialogComponent],
  exports: [CreateContactDialogComponent],
  providers: [provideManagersFeature()],
})
export class CreateContactDialogModule implements DynamicModule {
  public entry = CreateContactDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
