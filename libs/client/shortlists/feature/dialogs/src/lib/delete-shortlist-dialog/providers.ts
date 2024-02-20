import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { DeleteShortlistDialogComponent } from './delete-shortlist-dialog.component';

@NgModule({
  imports: [DeleteShortlistDialogComponent],
  exports: [DeleteShortlistDialogComponent],
  providers: [],
})
export class DeleteShortlistDialogModule implements DynamicModule {
  public entry = DeleteShortlistDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
