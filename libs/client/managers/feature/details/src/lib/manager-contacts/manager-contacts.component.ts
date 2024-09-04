import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';

import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ManagersActions } from '@app/client/managers/state';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { FundManagerData } from '@app/rvns-fund-managers';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import { managerContactsStore } from './manager-contacts.store';

@Component({
  selector: 'app-manager-contacts-table',
  standalone: true,
  imports: [
    RouterLink,
    GridModule,
    ButtonModule,
    LabelModule,
    NgClass,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './manager-contacts.component.html',
  styleUrls: ['./manager-contacts.component.scss'],
  providers: [managerContactsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerContactsComponent implements OnInit {
  public readonly managerContactsStore = inject(managerContactsStore);
  public readonly actions$ = inject(Actions);
  public readonly destroyRef = inject(DestroyRef);

  public addNewQueryParams = {
    [DialogUtil.queryParams.createManagerContact]: true,
  };

  public ngOnInit(): void {
    this.actions$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        ofType(
          ManagersActions.updateManagerContactSuccess,
          ManagersActions.updateManagerContactFailure,
          ManagersActions.createManagerContactSuccess,
          ManagersActions.createManagerContactFailure,
          ManagersActions.removeManagerContactSuccess,
          ManagersActions.removeManagerContactFailure,
        ),
      )
      .subscribe(() =>
        this.managerContactsStore.loadData(
          this.managerContactsStore.tableParams(),
        ),
      );
  }

  public getMailto(email: string): string {
    return `mailto:${email}`;
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };

  public loadMore(tableHeight: number): void {
    this.managerContactsStore.loadMore(tableHeight);
  }

  protected getActionData(
    contact: FundManagerData,
  ): DropdownbuttonNavigationModel {
    return {
      actions: [
        {
          text: 'Edit contact',
          queryParamsHandling: 'merge',
          routerLink: ['./'],
          queryParams: {
            [DialogUtil.queryParams.updateManagerContact]: contact.id!,
          },
          skipLocationChange: true,
        },
        {
          text: 'Remove contact',
          queryParamsHandling: 'merge',
          routerLink: ['./'],
          queryParams: {
            [DialogUtil.queryParams.removeManagerContact]: contact.id!,
          },
          skipLocationChange: true,
        },
      ],
    };
  }
}
