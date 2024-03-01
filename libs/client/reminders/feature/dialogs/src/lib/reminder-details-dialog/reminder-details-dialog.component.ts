import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { DatePipe } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import { TagsContainerComponent } from '@app/client/shared/ui';
import { PicklistPipe, ToUserTagPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { selectCreateReminderViewModel } from './remidner-details-dialog.selectors';

@Component({
  selector: 'app-reminder-details-dialog',
  standalone: true,
  imports: [
    DialogModule,
    TagsContainerComponent,
    PicklistPipe,
    ToUserTagPipe,
    DatePipe,
  ],
  templateUrl: './reminder-details-dialog.component.html',
  styleUrls: ['./reminder-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailsDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.reminderDetails;

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectCreateReminderViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }
}
