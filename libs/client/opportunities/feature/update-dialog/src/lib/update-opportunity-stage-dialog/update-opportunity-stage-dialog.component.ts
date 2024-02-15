import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import {
  FormFieldModule,
  RadioButtonModule,
  SwitchModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

import { KeyValuePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityUtils } from '@app/client/opportunities/utils';
import { OrganisationsActions } from '@app/client/organisations/state';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { startWith, take } from 'rxjs';
import { selectUpdateOpportunityStageViewModel } from './update-opportunity-stage-dialog.selectors';

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [
    DialogModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    RadioButtonModule,
    ButtonModule,
    LoaderModule,
    ReactiveFormsModule,
    DropDownListModule,
    ErrorMessagePipe,
    KeyValuePipe,
    SwitchModule,
  ],
  templateUrl: './update-opportunity-stage-dialog.component.html',
  styleUrls: ['./update-opportunity-stage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOpportunityStageDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected formGroup = inject(FormBuilder).group({
    name: [<string | null>null],
    round: [<string | null>null],
    stage: [<string | null>null, Validators.required],
  });

  protected stageId = toSignal(
    this.formGroup.controls.stage.valueChanges.pipe(
      startWith(this.formGroup.controls.stage.value),
    ),
  );

  protected stage = computed(() => {
    return this.vm().stages.data.find((s) => s.id === this.stageId());
  });

  protected showActions = computed(() => {
    return (
      OpportunityUtils.isLostStage(this.stage()) ||
      OpportunityUtils.isPassStage(this.stage())
    );
  });

  protected submitButtonTheme = computed(() => {
    return OpportunityUtils.isLostStage(this.stage()) ||
      OpportunityUtils.isPassStage(this.stage())
      ? 'secondary'
      : 'primary';
  });

  protected submitButtonText = computed(() => {
    return OpportunityUtils.isLostStage(this.stage())
      ? 'Mark status as Lost'
      : OpportunityUtils.isPassStage(this.stage())
        ? 'Mark status as Passed'
        : OpportunityUtils.isWonStage(this.stage())
          ? 'Mark status as Won/Portfolio'
          : 'Update Opportunity Status';
  });

  protected vm = this.store.selectSignal(selectUpdateOpportunityStageViewModel);

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogQueryParams.updateOpportunityStage]: null,
        },
        queryParamsHandling: 'merge',
      });
    });

    this.store.dispatch(
      OpportunitiesActions.getOpportunityDetails({
        id: this.vm().opportunityId!,
      }),
    );

    this.formGroup.controls.stage.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const stage = this.vm().stages.data.find((s) => s.id === value);
        if (OpportunityUtils.stageRequiresRound(stage)) {
          this.formGroup.controls.round.setValidators(Validators.required);
          this.formGroup.controls.round.updateValueAndValidity();
        } else {
          this.formGroup.controls.round.clearValidators();
          this.formGroup.controls.round.updateValueAndValidity();
        }
      });

    effect(
      () => {
        if (this.vm().disabledOpportunityDropdown) {
          this.formGroup.controls.round.disable();
        } else {
          this.formGroup.controls.round.enable();
        }
      },
      {
        allowSignalWrites: true,
      },
    );
    this.formGroup.controls.name.disable();
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    this.store.dispatch(
      OpportunitiesActions.updateOpportunity({
        id: this.vm().opportunityId!,
        changes: {
          pipelineStageId: this.formGroup.controls.stage.value!,
          opportunityTagId: this.formGroup.controls.round.value,
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunitySuccess), take(1))
      .subscribe((data) => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().organisation.id!,
          }),
        );
        this.dialog?.close();
      });

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunityFailure), take(1))
      .subscribe((data) => {
        this.dialog?.close();
      });
  }
}
