/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { RemindersActions } from '@app/client/reminders/state';
import { ReminderForm, ReminderFormComponent } from '@app/client/reminders/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  REMINDER_COMPANY_SOURCE,
  REMINDER_USERS_SOURCE,
  UPDATE_REMINDER_FORM_FN,
} from '@app/client/reminders/utils';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import {
  ControlHasChangesPipe,
  ControlInvalidPipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import { first } from 'rxjs';
import { createReminderStore } from '../create-reminder-container/create-reminder-container.component';
import {
  selectUpdateReminderViewModel,
  selectUpdatingReminder,
} from './update-reminder-dialog.selectors';

@Component({
  selector: 'app-update-reminder-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    ControlHasChangesPipe,
    AsyncPipe,
    RxPush,
    ControlInvalidPipe,
    ReminderFormComponent,
  ],
  templateUrl: './update-reminder-dialog.component.html',
  styleUrls: ['./update-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateReminderDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.updateReminder;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectUpdateReminderViewModel);
  protected curentReminder$ = this.store.select(selectUpdatingReminder);

  protected updateForm: ReminderForm;

  protected companySourceFn = inject(REMINDER_COMPANY_SOURCE);
  protected usersSourceFn = inject(REMINDER_USERS_SOURCE);

  public constructor(dialog: DialogRef) {
    super(dialog);
    const updateFormFn = inject(UPDATE_REMINDER_FORM_FN);

    this.curentReminder$.pipe(first((x) => !!x)).subscribe((reminder) => {
      this.updateForm = updateFormFn(reminder!);
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const rawValue = this.updateForm.getRawValue();

    this.store.dispatch(
      RemindersActions.updateReminder({
        id: this.vm().id,
        changes: {
          name: rawValue.title ?? '',
          description: rawValue.description ?? '',
          assignees: rawValue.assignees ?? [],
          dueDate: rawValue.dueDate!,
          tag: rawValue.tag
            ? {
                companyId: rawValue.tag.company.id,
                opportunityId: rawValue.tag.opportunity?.id,
              }
            : undefined,
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          RemindersActions.updateReminderSuccess,
          RemindersActions.updateReminderFailure,
        ),
        first(),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }

  protected readonly createReminderStore = createReminderStore;
}
