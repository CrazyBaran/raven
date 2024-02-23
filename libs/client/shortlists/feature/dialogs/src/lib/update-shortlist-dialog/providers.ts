import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { UpdateShortlistDialogComponent } from './update-shortlist-dialog.component';

@NgModule({
  imports: [UpdateShortlistDialogComponent],
  exports: [UpdateShortlistDialogComponent],
  providers: [provideShortlistsFeature()],
})
export class UpdateShortlistDialogModule implements DynamicModule {
  public entry = UpdateShortlistDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
