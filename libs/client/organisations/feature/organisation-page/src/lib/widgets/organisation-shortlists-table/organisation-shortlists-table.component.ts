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
  providers: [organisationShortlistsTableStore],
})
export class OrganisationShortlistsTableComponent {
  public actions$ = inject(Actions);
  public organisationShortlistsStore = inject(organisationShortlistsTableStore);

  protected getActionData(
    shortlist: ShortlistEntity,
  ): DropdownbuttonNavigationModel {
    return {
      actions:
        shortlist.type === 'custom'
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
