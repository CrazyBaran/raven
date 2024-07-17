import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RemindersActions } from '@app/client/reminders/state';
import { LoaderComponent, TagsContainerComponent } from '@app/client/shared/ui';
import {
  DynamicDialogContentBase,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
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
    ShowTooltipIfClampedDirective,
    LoaderComponent,
    RouterLink,
  ],
  templateUrl: './reminder-details-dialog.component.html',
  styleUrls: ['./reminder-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailsDialogComponent
  extends DynamicDialogContentBase
  implements OnInit
{
  public route = DialogUtil.queryParams.reminderDetails;

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectCreateReminderViewModel);

  public ngOnInit(): void {
    this.store.dispatch(
      RemindersActions.getReminder({ id: this.vm().reminderId }),
    );
  }

  public reminderDetailsQuery(id: string): Record<string, string> {
    return { [DialogUtil.queryParams.reminderDetails]: id };
  }

  public getReminderTagLink(): string[] {
    return ['/companies', this.vm()?.organisationId];
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }
}
