import { NgModule } from '@angular/core';
import {
  ComponentData,
  DynamicModule,
} from '@app/client/shared/dynamic-renderer/data-access';

import { provideRemindersFeature } from '@app/client/reminders/state';
import { CompleteReminderDialogComponent } from './complete-reminder-dialog.component';

@NgModule({
  imports: [CompleteReminderDialogComponent],
  exports: [CompleteReminderDialogComponent],
  providers: [provideRemindersFeature()],
})
export class CompleteReminderDialogModule implements DynamicModule {
  public entry = CompleteReminderDialogComponent;
  public componentDataResolver = (data: ComponentData): unknown => {
    return {};
  };
}
