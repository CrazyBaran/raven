import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { CreateShortlistDialogComponent } from './create-shortlist-dialog.component';

@NgModule({
  imports: [CreateShortlistDialogComponent],
  exports: [CreateShortlistDialogComponent],
  providers: [],
})
export class CreateShortlistDialogModule implements DynamicModule {
  public entry = CreateShortlistDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
