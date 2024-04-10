import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideShortlistsFeature } from '@app/client/shortlists/state';
import { RemoveShortlistFromOrganisationDialogComponent } from './remove-shortlist-from-organisation-dialog.component';

@NgModule({
  imports: [RemoveShortlistFromOrganisationDialogComponent],
  exports: [RemoveShortlistFromOrganisationDialogComponent],
  providers: [provideShortlistsFeature()],
})
export class RemoveShortlistFromOrganisationDialogModule
  implements DynamicModule
{
  public entry = RemoveShortlistFromOrganisationDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
