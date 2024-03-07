import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PanelBarModule } from '@progress/kendo-angular-layout';

import { DatePipe } from '@angular/common';
import { RemindersLightTableComponent } from '@app/client/reminders/ui';
import { TagsContainerComponent } from '@app/client/shared/ui';
import { PicklistPipe, ToUserTagPipe } from '@app/client/shared/ui-pipes';
import { DropdownButtonNavigationComponent } from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationContactsStore } from './organisation-contacts.store';

@Component({
  selector: 'app-organisation-reminders-table',
  standalone: true,
  imports: [
    PanelBarModule,
    RemindersLightTableComponent,
    ButtonModule,
    DatePipe,
    DropdownButtonNavigationComponent,
    GridModule,
    PicklistPipe,
    TagsContainerComponent,
    ToUserTagPipe,
    TooltipModule,
  ],
  templateUrl: './organisation-contacts.component.html',
  styleUrls: ['./organisation-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [organisationContactsStore],
})
export class OrganisationContactsComponent {
  public organisationRemindersStore = inject(organisationContactsStore);
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
