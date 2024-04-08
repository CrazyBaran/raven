import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { RemindersActions } from '@app/client/reminders/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { DialogUtil } from '@app/client/shared/util';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectDeleteReminderViewModel } from './delete-reminder-dialog.selectors';

@Component({
  selector: 'app-delete-reminder-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './delete-reminder-dialog.component.html',
  styleUrls: ['./delete-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteReminderDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.deleteReminder;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectDeleteReminderViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected delete(): void {
    this.store.dispatch(RemindersActions.deleteReminder({ id: this.vm().id }));

    this.actions$
      .pipe(
        ofType(
          RemindersActions.deleteReminderSuccess,
          RemindersActions.deleteReminderFailure,
        ),
        take(1),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
