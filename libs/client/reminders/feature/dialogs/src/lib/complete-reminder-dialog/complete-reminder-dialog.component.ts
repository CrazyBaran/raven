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
import { selectCompleteReminderViewModel } from './complete-reminder-dialog.selectors';

@Component({
  selector: 'app-complete-reminder-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './complete-reminder-dialog.component.html',
  styleUrls: ['./complete-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteReminderDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.completeReminder;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectCompleteReminderViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected delete(): void {
    this.store.dispatch(
      RemindersActions.completeReminder({ ids: this.vm().ids }),
    );

    this.actions$
      .pipe(
        ofType(
          RemindersActions.completeReminderSuccess,
          RemindersActions.completeReminderFailure,
        ),
        take(1),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
