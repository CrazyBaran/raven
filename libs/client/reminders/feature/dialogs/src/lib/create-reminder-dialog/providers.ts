import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideRemindersFeature } from '@app/client/reminders/state';
import { CreateReminderDialogComponent } from './create-reminder-dialog.component';

@NgModule({
  imports: [CreateReminderDialogComponent],
  exports: [CreateReminderDialogComponent],
  providers: [provideRemindersFeature()],
})
export class CreateReminderDialogModule implements DynamicModule {
  public entry = CreateReminderDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
