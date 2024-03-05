import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideOrganisationFeature } from '@app/client/organisations/state';
import { provideRemindersFeature } from '@app/client/reminders/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { CreateReminderDialogComponent } from './create-reminder-dialog.component';

@NgModule({
  imports: [CreateReminderDialogComponent],
  exports: [CreateReminderDialogComponent],
  providers: [
    provideRemindersFeature(),
    provideTagsFeature(),
    provideOpportunitiesFeature(),
    provideOrganisationFeature(),
  ],
})
export class CreateReminderDialogModule implements DynamicModule {
  public entry = CreateReminderDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
