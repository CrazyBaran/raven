/* eslint-disable @angular-eslint/no-output-on-prefix,@typescript-eslint/no-explicit-any */
// TODO: Fix types

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  OpportunitiesActions,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  OpportunityForm,
  OpportunityFormComponent,
} from '@app/client/opportunities/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { first, switchMap, take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './create-opportunity-dialog.selectors';

@Component({
  selector: 'app-create-opportunity-on-stage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    RxLet,
    OpportunityFormComponent,
    ButtonModule,
    LoaderModule,
  ],
  templateUrl: './create-opportunity-on-stage-dialog.component.html',
  styleUrls: ['./create-opportunity-on-stage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOpportunityOnStageDialogComponent implements OnInit {
  public fb = inject(FormBuilder);
  public store = inject(Store);
  public actions$ = inject(Actions);

  public onCancel = output<void>();
  public onSubmit = output<void>();

  public params = input<{
    opportunityId: string;
    organisationId: string;
    pipelineStageId?: string;
  }>();

  public vm = toSignal(
    toObservable(this.params).pipe(
      switchMap((value) =>
        this.store.select(selectCreateOpportunityDialogViewModel(value!)),
      ),
    ),
  );

  public opporunityDetails$ = toObservable(this.params).pipe(
    switchMap((value) =>
      this.store.select(
        opportunitiesQuery.selectOpportunityDetails(value!.opportunityId),
      ),
    ),
    first((data) => !!data),
  );

  protected opportunityForm: OpportunityForm = this.fb.group({
    organisationId: [<string | null>null],
    opportunityTagId: [<string | null>null, [Validators.required]],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
    underNda: [<string | null>null],
    ndaTerminationDate: [<string | null>null],
    team: this.fb.control<{
      owners: [];
      members: [];
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

    this.opporunityDetails$?.subscribe((data) => {
      // fix pathValue typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.opportunityForm.patchValue({
        ..._.pickBy(data, (v, key) =>
          Object.keys(this.opportunityForm.controls).includes(key),
        ),
        opportunityTagId: data?.tag?.id,
        team: {
          owners: data?.team?.owners.map((o) => o.actorId) ?? [],
          members: data?.team?.members.map((m) => m.actorId) ?? [],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });
  }

  protected onDialogClose(): void {
    this.onCancel.emit();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.updateOpportunity({
        id: this.vm()!.opportunityDetails!.id,
        changes: {
          ...this.opportunityForm.getRawValue(),
          hasTeam: this.vm()!.hasTeam,
          pipelineStageId: this.params()?.pipelineStageId || undefined,
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunitySuccess), take(1))
      .subscribe((data) => {
        this.onSubmit.emit();
      });
  }
}
