/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  NgZone,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsContainerComponent } from '@app/client/shared/ui';
import { ShowTooltipIfClampedDirective } from '@app/client/shared/ui-directives';
import { PicklistPipe, ToUserTagPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  GridModule,
  PageChangeEvent,
  RowClassArgs,
  RowClassFn,
} from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { ReminderTableRow } from '../reminders-table/reminders-table.component';

export type RemindersLightTableRow = {
  name: string;
  dueDate: string | Date;
  assignees: {
    name: string;
  }[];
  actionsModel: DropdownbuttonNavigationModel | undefined;
};

@Component({
  selector: 'app-reminders-light-table',
  standalone: true,
  imports: [
    GridModule,
    RxUnpatch,
    ShowTooltipIfClampedDirective,
    TooltipModule,
    ButtonModule,
    PicklistPipe,
    ToUserTagPipe,
    TagsContainerComponent,
    DatePipe,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './reminders-light-table.component.html',
  styleUrl: './reminders-light-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RemindersLightTableComponent {
  @Output() public pageChange = new EventEmitter<PageChangeEvent>();
  @Output() public sortChange = new EventEmitter<Array<SortDescriptor>>();

  public ngZone = inject(NgZone);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public items = input.required<{
    data: RemindersLightTableRow[];
    total: number;
  }>();
  public loading = input<boolean>();
  public pageSize = input<number>();
  public skip = input<number>();
  public sort = input<SortDescriptor[]>();

  public rowCallback: RowClassFn = (context: RowClassArgs) => {
    const row = context.dataItem as ReminderTableRow;

    return { [`reminder-type-${row.status}`]: true };
  };

  public onReminderClick(reminder: ReminderTableRow): void {
    this.ngZone.run(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { [DialogUtil.queryParams.reminderDetails]: reminder.id },
        queryParamsHandling: 'merge',
        skipLocationChange: true,
      });
    });
  }
}
