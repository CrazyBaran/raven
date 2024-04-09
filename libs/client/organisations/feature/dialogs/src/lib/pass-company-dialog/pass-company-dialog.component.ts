import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';

import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';
import { CreateReminderContainerComponent } from '@app/client/reminders/feature/dialogs';
import { RemindersActions } from '@app/client/reminders/state';
import { ReminderFormComponent } from '@app/client/reminders/ui';
import {
  CRAETE_REMINDER_FORM,
  providerReminderForm,
} from '@app/client/reminders/utils';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  FormFieldModule,
  SwitchModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { StepperModule } from '@progress/kendo-angular-layout';
import { RxPush } from '@rx-angular/template/push';
import { CompanyStatus } from 'rvns-shared';
import { first } from 'rxjs';
import { selectPassCompanyDialogViewModel } from './pass-company-dialog.selectors';

export const expandOnInitAnimation = trigger('expandOnInit', [
  state('enter', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
  state(
    'void, exit',
    style({
      height: '0',
      visibility: 'hidden',
    }),
  ),
  transition(':enter', [animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
  transition(
    '* => void, * => leave',
    animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
  ),
]);

@Component({
  selector: 'app-pass-company-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    StepperModule,
    SwitchModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    ReactiveFormsModule,
    TextBoxModule,
    ReminderFormComponent,
    CreateReminderContainerComponent,
    ControlInvalidPipe,
    RxPush,
  ],
  templateUrl: './pass-company-dialog.component.html',
  styleUrls: ['./pass-company-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm],
  animations: [expandOnInitAnimation],
})
export class PassCompanyDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vm = this.store.selectSignal(selectPassCompanyDialogViewModel);

  protected currentStep = signal(0);

  protected reminderForm = inject(CRAETE_REMINDER_FORM);

  protected steps = [
    { label: 'Update Status', isValid: true },
    { label: 'Options', isValid: true },
  ];

  protected companyControl = new FormControl({ value: '', disabled: true });

  protected removeCompanyFromShortlist = new FormControl(true);
  protected setReminderForm = new FormControl(false);

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogUtil.queryParams.passCompany]: null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    this.store.dispatch(
      OrganisationsActions.updateOrganisation({
        id: this.vm().organisationId!,
        changes: {
          companyStatus: CompanyStatus.PASSED,
        },
      }),
    );

    if (this.removeCompanyFromShortlist.value) {
      this.store.dispatch(
        ShortlistsActions.removeOrganisationFromMyShortlist({
          organisationId: this.vm().organisationId!,
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
      .pipe(ofType(OrganisationsActions.updateOrganisationSuccess), first())
      .subscribe(() => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().organisationId!,
          }),
        );
        this.dialog.close();
      });
  }
}
