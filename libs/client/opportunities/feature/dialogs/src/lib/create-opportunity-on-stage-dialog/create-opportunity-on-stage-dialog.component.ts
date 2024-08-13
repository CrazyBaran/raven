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
import { TagsActions, tagsQuery } from '@app/client/tags/state';
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
import { combineLatest, first, switchMap, take } from 'rxjs';
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

  public userDetails$ = toObservable(this.params).pipe(
    switchMap(() => this.store.select(tagsQuery.selectCurrentUserTag)),
    first((data) => !!data),
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

    combineLatest([this.opporunityDetails$, this.userDetails$]).subscribe(
      ([data, userData]) => {
        const owners = data?.team?.owners.map((o) => o.actorId) ?? [];
        const members = data?.team?.members.map((m) => m.actorId) ?? [];
        if (userData?.userId) {
          if (!owners.length && !members.length) {
            owners.push(userData.userId);
          }
        }
        this.opportunityForm.patchValue({
          ..._.pickBy(data, (v, key) =>
            Object.keys(this.opportunityForm.controls).includes(key),
          ),
          opportunityTagId: data?.tag?.id,
          team: {
            owners,
            members,
          },
        } as any);
      },
    );
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
