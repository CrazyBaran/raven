import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideOpportunitiesFeature } from '@app/client/opportunities/data-access';
import { provideOrganisationFeature } from '@app/client/organisations/state';
import { provideRemindersFeature } from '@app/client/reminders/state';
import { provideTagsFeature } from '@app/client/tags/state';
import { CreateReminderContainerComponent } from './create-reminder-container.component';

@NgModule({
  imports: [CreateReminderContainerComponent],
  exports: [CreateReminderContainerComponent],
  providers: [
    provideRemindersFeature(),
    provideTagsFeature(),
    provideOpportunitiesFeature(),
    provideOrganisationFeature(),
  ],
})
export class CreateReminderDialogModule implements DynamicModule {
  public entry = CreateReminderContainerComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
