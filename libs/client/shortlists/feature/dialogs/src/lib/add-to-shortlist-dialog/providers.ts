import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { AddToShortlistDialogComponent } from './add-to-shortlist-dialog.component';

@NgModule({
  imports: [AddToShortlistDialogComponent],
  exports: [AddToShortlistDialogComponent],
  providers: [provideShortlistsFeature()],
})
export class AddToShortlistDialogModule implements DynamicModule {
  public entry = AddToShortlistDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
