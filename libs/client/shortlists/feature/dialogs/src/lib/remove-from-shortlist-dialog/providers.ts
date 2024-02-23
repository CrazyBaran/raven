import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { RemoveFromShortlistDialogComponent } from './remove-from-shortlist-dialog.component';

@NgModule({
  imports: [RemoveFromShortlistDialogComponent],
  exports: [RemoveFromShortlistDialogComponent],
  providers: [provideShortlistsFeature()],
})
export class RemoveFromShortlistDialogModule implements DynamicModule {
  public entry = RemoveFromShortlistDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
