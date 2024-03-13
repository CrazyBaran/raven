/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe, JsonPipe } from '@angular/common';
import { RemindersActions } from '@app/client/reminders/state';
import { ReminderFormComponent } from '@app/client/reminders/ui';
import {
  CRAETE_REMINDER_FORM,
  providerReminderForm,
} from '@app/client/reminders/utils';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import {
  ControlInvalidPipe,
  ControlStatePipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { TagsService } from '@app/client/tags/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { CreateReminderContainerComponent } from '../create-reminder-container/create-reminder-container.component';
import { selectCreateReminderViewModel } from './create-remidner-dialog.selectors';

@Component({
  selector: 'app-create-reminder-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    ControlStatePipe,
    AsyncPipe,
    ControlInvalidPipe,
    ReminderFormComponent,
    JsonPipe,
    CreateReminderContainerComponent,
  ],
  templateUrl: './create-reminder-dialog.component.html',
  styleUrls: ['./create-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm],
})
export class CreateReminderDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.createReminder;

  protected store = inject(Store);

  protected actions$ = inject(Actions);

  protected tagsService = inject(TagsService);

  protected vm = this.store.selectSignal(selectCreateReminderViewModel);

  protected form = inject(CRAETE_REMINDER_FORM);

  protected staticCompany = signal<{ name: string; id: string } | undefined>(
    undefined,
  );

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const value = this.form.getRawValue();
    this.store.dispatch(
      RemindersActions.createReminder({
        data: {
          name: value.title!,
          description: value.description!,
          dueDate: value.dueDate!,
          assignees: value.assignees!,
          tag: value.tag
            ? {
                companyId: value.tag.company.id,
                opportunityId: value.tag.opportunity?.id ?? '',
              }
            : undefined,
        },
      }),
    );

    this.actions$
      .pipe(ofType(RemindersActions.createReminderSuccess), take(1))
      .subscribe((response) => {
        this.dialog.close();
      });
  }
}
