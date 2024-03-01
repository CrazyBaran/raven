import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideRemindersFeature } from '@app/client/reminders/state';
import { ReminderDetailsDialogComponent } from './reminder-details-dialog.component';

@NgModule({
  imports: [ReminderDetailsDialogComponent],
  exports: [ReminderDetailsDialogComponent],
  providers: [provideRemindersFeature()],
})
export class ReminderDetailsDialogModule implements DynamicModule {
  public entry = ReminderDetailsDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
