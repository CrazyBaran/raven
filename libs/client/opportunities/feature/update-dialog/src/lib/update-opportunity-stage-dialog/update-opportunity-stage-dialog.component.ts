/* eslint-disable @nx/enforce-module-boundaries */
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
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityUtils } from '@app/client/opportunities/utils';
import { OrganisationsActions } from '@app/client/organisations/state';
import { RemindersActions } from '@app/client/reminders/state';
import {
  CRAETE_REMINDER_FORM,
  providerReminderForm,
} from '@app/client/reminders/utils';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import { startWith, take } from 'rxjs';
import { CreateReminderContainerComponent } from '../../../../../../reminders/feature/dialogs/src/lib/create-reminder-container/create-reminder-container.component';
import { selectUpdateOpportunityStageViewModel } from './update-opportunity-stage-dialog.selectors';

export type SelectedStageType = 'won' | 'lost' | 'pass' | 'other';

export interface DialogStageConfig {
  submitButtonText: string;
  submitButtonTheme: 'primary' | 'secondary';
  actionButtons?: boolean;
  actionInfo?: string;
}

export const DIALOG_STAGE_CONFIG: Record<SelectedStageType, DialogStageConfig> =
  {
    won: {
      submitButtonText: 'Mark status as Won/Portfolio',
      submitButtonTheme: 'primary',
      actionInfo:
        'This will update the status of the opportunity to Won and remove it from the pipeline view. The company will then be marked as a portfolio company and removed from the shortlist.',
    },
    lost: {
      submitButtonText: 'Mark status as Lost',
      submitButtonTheme: 'secondary',
      actionButtons: true,
      actionInfo:
        'This will update the status of the opportunity to lost and remove it from the pipeline view.',
    },
    pass: {
      submitButtonText: 'Mark status as Passed',
      submitButtonTheme: 'secondary',
      actionButtons: true,
      actionInfo:
        'This will update the status of the opportunity to passed and remove it from the pipeline view.',
    },
    other: {
      submitButtonText: 'Update Opportunity Status',
      submitButtonTheme: 'primary',
    },
  };

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
    CreateReminderContainerComponent,
    ControlInvalidPipe,
    RxPush,
  ],
  templateUrl: './update-opportunity-stage-dialog.component.html',
  styleUrls: ['./update-opportunity-stage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm],
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

  protected reminderForm = inject(CRAETE_REMINDER_FORM);

  protected removeCompanyFromShortlist = new FormControl(false);
  protected setReminderForm = new FormControl(false);

  protected stageId = toSignal(
    this.formGroup.controls.stage.valueChanges.pipe(
      startWith(this.formGroup.controls.stage.value),
    ),
  );

  protected stage = computed(() => {
    return this.vm().stages.data.find((s) => s.id === this.stageId());
  });

  protected dialogConfig = computed(() => {
    const type = OpportunityUtils.isLostStage(this.stage())
      ? 'lost'
      : OpportunityUtils.isPassStage(this.stage())
        ? 'pass'
        : OpportunityUtils.isWonStage(this.stage())
          ? 'won'
          : 'other';

    return DIALOG_STAGE_CONFIG[type];
  });

  protected vm = this.store.selectSignal(selectUpdateOpportunityStageViewModel);

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogUtil.queryParams.updateOpportunityStage]: null,
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

    if (this.removeCompanyFromShortlist.value) {
      this.store.dispatch(
        ShortlistsActions.removeOrganisationFromMyShortlist({
          organisationId: this.vm().organisation.id!,
        }),
      );
    }

    if (this.setReminderForm.value) {
      const value = this.reminderForm.getRawValue();
      this.store.dispatch(
        RemindersActions.createReminder({
          data: {
            name: value.title!,
            description: value.description!,
            dueDate: value.dueDate!,
            assignees: value.assignees!,
            tag: value.tag
              ? {
                  companyId: value.tag.company.id,
                  opportunityId: value.tag.opportunity?.id ?? '',
                }
              : undefined,
          },
        }),
      );
    }

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
