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

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';
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
import { CompanyStatus } from 'rvns-shared';
import { first } from 'rxjs';
import { selectPassCompanyDialogViewModel } from './pass-company-dialog.selectors';

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
  ],
  templateUrl: './pass-company-dialog.component.html',
  styleUrls: ['./pass-company-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCompanyDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vm = this.store.selectSignal(selectPassCompanyDialogViewModel);

  protected currentStep = signal(0);

  protected steps = [
    { label: 'Update Status', isValid: true },
    { label: 'Options', isValid: true },
  ];

  protected companyControl = new FormControl({ value: '', disabled: true });

  protected removeCompanyFromShortlist = new FormControl(true);

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

    this.actions$
      .pipe(ofType(OrganisationsActions.updateOrganisationSuccess), first())
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
