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
import { BadgeModule } from '@progress/kendo-angular-indicators';
import { organisationRemindersTableStore } from './organisation-reminders-table.store';
@Component({
  selector: 'app-organisation-reminders-table',
  standalone: true,
  imports: [
    PanelBarModule,
    RemindersLightTableComponent,
    ButtonModule,
    BadgeModule,
  ],
  templateUrl: './organisation-reminders-table.component.html',
  styleUrls: ['./organisation-reminders-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [organisationRemindersTableStore],
})
export class OrganisationRemindersTableComponent {
  public organisationRemindersStore = inject(organisationRemindersTableStore);
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
        ],
      },
      queryParamsHandling: 'merge',
      skipLocationChange: true,
    });
  }
}
