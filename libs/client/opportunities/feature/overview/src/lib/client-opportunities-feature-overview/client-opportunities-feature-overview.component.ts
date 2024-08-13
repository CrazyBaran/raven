import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { trigger } from '@angular/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NoteFieldComponent,
  NoteFieldSkeletonComponent,
} from '@app/client/opportunities/ui';
import {
  fadeIn,
  KendoDynamicPagingDirective,
  LoaderComponent,
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { dynamicDialogDirective } from '@app/client/shared/ui-directives';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  LoaderModule,
  SkeletonModule,
} from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  PanelBarModule,
  TileLayoutModule,
} from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import { OpportunityRemindersTableComponent } from '../opportunityy-reminders-table/opportunity-reminders-table.component';
import { selectOpportunityOverviewViewModel } from './client-opportunities-feature-overview.selectors';
import { DealTeamAdminDialogComponent } from './deal-team-admin-dialog/deal-team-admin-dialog.component';
import { OpportunityDescriptionComponent } from './opportunity-description/opportunity-description.component';
import { TagSkeletonComponent } from './tag-skeleton/tag-skeleton.component';

@Component({
  selector: 'app-client-opportunities-feature-overview',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    ButtonModule,
    PanelBarModule,
    RxFor,
    GridModule,
    TagComponent,
    UserTagDirective,
    RouterLink,
    KendoDynamicPagingDirective,
    LoaderComponent,
    SkeletonModule,
    TimesPipe,
    DialogModule,
    MultiSelectModule,
    LabelModule,
    FormFieldModule,
    ReactiveFormsModule,
    DropDownListModule,
    LoaderModule,
    OpportunityRemindersTableComponent,
    TilelayoutItemComponent,
    TagSkeletonComponent,
    DealTeamAdminDialogComponent,
    NoteFieldComponent,
    OpportunityDescriptionComponent,
    NoteFieldSkeletonComponent,
    dynamicDialogDirective,
  ],
  templateUrl: './client-opportunities-feature-overview.component.html',
  styleUrls: ['./client-opportunities-feature-overview.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureOverviewComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityOverviewViewModel);

  protected showEditTeam = signal(false);
  public constructor() {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );
  }

  protected openTeamEdit(): void {
    this.showEditTeam.set(true);
  }
}
