import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideRemindersFeature } from '@app/client/reminders/state';
import { DeleteReminderDialogComponent } from './delete-reminder-dialog.component';

@NgModule({
  imports: [DeleteReminderDialogComponent],
  exports: [DeleteReminderDialogComponent],
  providers: [provideRemindersFeature()],
})
export class DeleteReminderDialogModule implements DynamicModule {
  public entry = DeleteReminderDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
