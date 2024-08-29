import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideManagersFeature } from '@app/client/managers/state';
import { UpdateManagerDialogComponent } from './update-manager-dialog.component';

@NgModule({
  imports: [UpdateManagerDialogComponent],
  exports: [UpdateManagerDialogComponent],
  providers: [provideManagersFeature()],
})
export class UpdateManagerDialogModule implements DynamicModule {
  public entry = UpdateManagerDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
