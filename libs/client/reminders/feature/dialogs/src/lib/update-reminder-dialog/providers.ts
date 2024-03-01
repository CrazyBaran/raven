import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideRemindersFeature } from '@app/client/reminders/state';
import { UpdateReminderDialogComponent } from './update-reminder-dialog.component';

@NgModule({
  imports: [UpdateReminderDialogComponent],
  exports: [UpdateReminderDialogComponent],
  providers: [provideRemindersFeature()],
})
export class UpdateReminderDialogModule implements DynamicModule {
  public entry = UpdateReminderDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
