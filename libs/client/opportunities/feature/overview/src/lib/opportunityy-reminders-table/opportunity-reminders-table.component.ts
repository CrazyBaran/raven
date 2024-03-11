/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PanelBarModule } from '@progress/kendo-angular-layout';

import { RemindersLightTableComponent } from '@app/client/reminders/ui';
import { DialogUtil } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { opportunityRemindersTableStore } from './opportunity-reminders-table.store';

@Component({
  selector: 'app-opportunity-reminders-table',
  standalone: true,
  imports: [PanelBarModule, RemindersLightTableComponent, ButtonModule],
  templateUrl: './opportunity-reminders-table.component.html',
  styleUrls: ['./opportunity-reminders-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [opportunityRemindersTableStore],
})
export class OpportunityRemindersTableComponent {
  public organisationRemindersStore = inject(opportunityRemindersTableStore);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public onCreateReminder($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [DialogUtil.queryParams.createReminder]: [
          this.organisationRemindersStore.additionalParams().organisationId,
          this.organisationRemindersStore.opportunityId(),
        ],
      },
      queryParamsHandling: 'merge',
      skipLocationChange: true,
    });
  }
}
