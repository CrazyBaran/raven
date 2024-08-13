import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  OpportunitiesActions,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogModule } from '@progress/kendo-angular-dialog';

import {
  OpportunityForm,
  OpportunityFormComponent,
} from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './update-opportunity-dialog.selectors';

@Component({
  selector: 'app-update-opportunity-dialog',
  standalone: true,
  imports: [
    DialogModule,
    RxLet,
    OpportunityFormComponent,
    ButtonModule,
    LoaderModule,
  ],
  templateUrl: './update-opportunity-dialog.component.html',
  styleUrls: ['./update-opportunity-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOpportunityDialogComponent
  extends DynamicDialogContentBase
  implements OnInit
{
  public readonly route = 'update-opportunity';

  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected opporunityDetails$ = this.store.select(
    opportunitiesQuery.selectRouteOpportunityDetails,
  );

  protected opportunityForm: OpportunityForm = this.fb.group({
    organisationId: [<string | null>null],
    opportunityTagId: [<string | null>null, [Validators.required]],
    name: [<string | null>''],
    description: [<string | null | undefined>undefined],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
    underNda: [<string | null>null],
    ndaTerminationDate: [<string | null>null],
    coInvestors: [<string | null | undefined>undefined],
    capitalRaiseHistory: [<string | null | undefined>undefined],
    team: this.fb.control<{
      owners: string[];
      members: string[];
    }>({
      owners: [],
      members: [],
    }),
  });

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'company'],
      }),
    );

    this.opporunityDetails$.subscribe((data) => {
      this.opportunityForm.patchValue({
        ..._.pickBy(data, (v, key) =>
          Object.keys(this.opportunityForm.controls).includes(key),
        ),
        opportunityTagId: data?.tag?.id,
        team: null,
      });
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.updateOpportunity({
        id: this.vm()!.opportunityDetails!.id,
        changes: {
          ...this.opportunityForm.getRawValue(),
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunitySuccess), take(1))
      .subscribe((data) => {
        if (data.data.organisation.id) {
          this.store.dispatch(
            OrganisationsActions.addOpportunityToOrganisation({
              id: data.data.organisation.id,
              opportunityId: data.data.id,
            }),
          );
        }
        this.dialog?.close();
      });
  }
}
