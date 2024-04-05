import { Component, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OpportunitiesActions,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import {
  DealTeamPickerComponent,
  DealTeamPickerValue,
} from '@app/client/opportunities/ui';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import { tagsQuery } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { take, tap } from 'rxjs';

export const selectDealTeamAdminDialogViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  tagsQuery.selectPeopleTags,
  opportunitiesQuery.selectUpdateTeam,
  (opportunity, people, { isLoading }) => {
    return {
      opportunity,
      people,
      isLoading: isLoading,
    };
  },
);

@Component({
  selector: 'app-deal-team-admin-dialog',
  standalone: true,
  imports: [
    DialogModule,
    FormFieldModule,
    MultiSelectModule,
    LabelModule,
    ReactiveFormsModule,
    TagComponent,
    DropDownListModule,
    ButtonModule,
    LoaderModule,
    UserTagDirective,
    DealTeamPickerComponent,
  ],
  templateUrl: './deal-team-admin-dialog.component.html',
  styleUrl: './deal-team-admin-dialog.component.scss',
})
export class DealTeamAdminDialogComponent {
  public dialogClose = output();

  protected actions = inject(Actions);

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectDealTeamAdminDialogViewModel);

  protected dealTeamPickerControl = new FormControl<DealTeamPickerValue>({
    owners: [],
    members: [],
  });

  public constructor() {
    setTimeout(() => {
      const { team } = this.vm().opportunity!;

      if (!team) {
        return;
      }

      this.dealTeamPickerControl.setValue(
        {
          owners: team.owners.map((o) => o.actorId),
          members: team.members.map((m) => m.actorId),
        },
        { emitEvent: false },
      );
    });
  }

  protected updateTeam(): void {
    this.store.dispatch(
      OpportunitiesActions.updateOpportunityTeam({
        id: this.vm().opportunity!.id,
        method: this.vm().opportunity!.team?.owners.length ? 'patch' : 'post',
        payload: this.dealTeamPickerControl.value!,
      }),
    );

    this.actions
      .pipe(
        ofType(OpportunitiesActions.updateOpportunityTeamSuccess),
        take(1),
        tap(() => {
          this.dialogClose.emit();
        }),
      )
      .subscribe();
  }
}
