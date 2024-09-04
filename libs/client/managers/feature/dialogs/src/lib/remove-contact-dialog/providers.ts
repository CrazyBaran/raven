import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { RemoveContactDialogComponent } from './remove-contact-dialog.component';

@NgModule({
  imports: [RemoveContactDialogComponent],
  exports: [RemoveContactDialogComponent],
  providers: [provideShortlistsFeature()],
})
export class RemoveContactDialogModule implements DynamicModule {
  public entry = RemoveContactDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
