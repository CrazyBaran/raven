import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DatePipe, NgClass } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  KendoUrlSortingDirective,
  TagsContainerComponent,
} from '@app/client/shared/ui';
import {
  FeatureFlagDirective,
  InfinityTableViewBaseComponent,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { ToUserTagPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  GridModule,
  RowClassArgs,
  RowClassFn,
} from '@progress/kendo-angular-grid';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { RxLet } from '@rx-angular/template/let';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';

export interface ReminderTableRow {
  id: string;
  name: string;
  tag: {
    company: string | undefined;
    opportunity: string | undefined;
  };
  assignees: string[];
  dueDate: string | Date;
  status: 'overdue' | 'due' | 'completed';
  actionsModel: DropdownbuttonNavigationModel;
}

@Component({
  selector: 'app-reminders-table',
  standalone: true,
  imports: [
    GridModule,
    KendoUrlSortingDirective,
    RouterLink,
    ButtonModule,
    ShowTooltipIfClampedDirective,
    TooltipModule,
    TagsContainerComponent,
    ToUserTagPipe,
    DatePipe,
    DropdownButtonNavigationComponent,
    RxUnpatch,
    CheckBoxModule,
    FeatureFlagDirective,
    RxLet,
    NgClass,
  ],
  templateUrl: './reminders-table.component.html',
  styleUrl: './reminders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RemindersTableComponent extends InfinityTableViewBaseComponent<ReminderTableRow> {
  public checkedRows$ = new BehaviorSubject<string[]>([]);
  public data$ = toObservable(this.model).pipe(
    map((model) => model?.data ?? []),
    distinctUntilChangedDeep(),
  );

  public checkboxAllState$ = combineLatest([
    this.checkedRows$,
    this.data$,
  ]).pipe(
    map(([checkedRows, data]) => {
      if (checkedRows.length === 0) {
        return 'none';
      } else if (checkedRows.length === data.length) {
        return 'checked';
      } else {
        return 'indeterminate';
      }
    }),
    distinctUntilChanged(),
  );

  public ngZone = inject(NgZone);

  public trackByFn = this.getTrackByFn('id');

  public reminderDetailsQuery(id: string): Record<string, string> {
    return { [DialogUtil.queryParams.reminderDetails]: id };
  }

  public rowCallback: RowClassFn = (context: RowClassArgs) => {
    const row = context.dataItem as ReminderTableRow;

    return { [`reminder-type-${row.status}`]: true };
  };

  public onReminderClick(reminder: ReminderTableRow): void {
    this.ngZone.run(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: this.reminderDetailsQuery(reminder.id),
        queryParamsHandling: 'merge',
      });
    });
  }

  public toggleAll(checkboxAllState: string): void {
    if (checkboxAllState === 'checked') {
      this.checkedRows$.next([]);
    } else {
      this.checkedRows$.next(this.data.map((x) => x.id));
    }
  }

  public checkboxState(id: string): Observable<boolean> {
    return this.checkedRows$.pipe(
      map((ids) => ids.includes(id)),
      distinctUntilChanged(),
    );
  }

  public toggleCheckedRow(id: string): void {
    const rowChecked = this.checkedRows$.value.includes(id);

    if (rowChecked) {
      this.checkedRows$.next(this.checkedRows$.value.filter((x) => x !== id));
    } else {
      this.checkedRows$.next([...this.checkedRows$.value, id]);
    }
  }

  public onBulkComplete(): void {
    this.ngZone.run(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogUtil.queryParams.completeReminder]: this.checkedRows$.value,
        },
        queryParamsHandling: 'merge',
      });
    });
  }
}
