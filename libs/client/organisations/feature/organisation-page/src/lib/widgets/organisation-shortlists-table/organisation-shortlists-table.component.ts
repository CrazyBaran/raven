import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { LoaderComponent, TagsContainerComponent } from '@app/client/shared/ui';
import { GridModule } from '@progress/kendo-angular-grid';
import { PanelBarModule } from '@progress/kendo-angular-layout';

import { DatePipe } from '@angular/common';
import { selectUserData } from '@app/client/core/auth';
import {
  FeatureFlagDirective,
  IsEllipsisActiveDirective,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { ToUserTagPipe } from '@app/client/shared/ui-pipes';
import {
  DropdownButtonNavigationComponent,
  DropdownbuttonNavigationModel,
} from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistEntity } from '@app/client/shortlists/state';
import {
  IsMyShortlistTypePipe,
  IsPersonalShortlistTypePipe,
} from '@app/client/shortlists/ui';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationShortlistsTableStore } from './organisation-shortlists-table.store';

@Component({
  selector: 'app-organisation-shortlists-table',
  standalone: true,
  imports: [
    PanelBarModule,
    IsEllipsisActiveDirective,
    GridModule,
    RouterLink,
    TooltipModule,
    ShowTooltipIfClampedDirective,
    TagsContainerComponent,
    ToUserTagPipe,
    DatePipe,
    FeatureFlagDirective,
    IsMyShortlistTypePipe,
    IsPersonalShortlistTypePipe,
    LoaderComponent,
    DropdownButtonNavigationComponent,
  ],
  templateUrl: './organisation-shortlists-table.component.html',
  styleUrls: ['./organisation-shortlists-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrganisationShortlistsTableComponent {
  public actions$ = inject(Actions);
  public store = inject(Store);

  public organisationShortlistsStore = inject(organisationShortlistsTableStore);
  public userData = this.store.selectSignal(selectUserData); // NOTE we dont have user id, only email/username

  protected getActionData(
    shortlist: ShortlistEntity,
  ): DropdownbuttonNavigationModel {
    return {
      actions:
        shortlist.type === 'custom' ||
        (this.userData()
          ? shortlist.name.includes(this.userData()!.name!)
          : false)
          ? [
              {
                text: 'Remove Shortlist',
                queryParamsHandling: 'merge',
                routerLink: ['./'],
                queryParams: {
                  [DialogUtil.queryParams.removeShortlistFromOrganisation]:
                    shortlist.id!,
                },
                skipLocationChange: true,
              },
            ]
          : [],
    };
  }
}
