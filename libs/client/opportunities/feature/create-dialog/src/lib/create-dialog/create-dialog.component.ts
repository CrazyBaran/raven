import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogsModule,
} from '@progress/kendo-angular-dialog';
import {
  ComboBoxModule,
  DropDownListModule,
} from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  RadioButtonModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { xIcon } from '@progress/kendo-svg-icons';
import { RxLet } from '@rx-angular/template/let';
import { take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './create-dialog.selectors';

@Component({
  selector: 'app-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    DropDownListModule,
    RadioButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DialogsModule,
    RxLet,
    ComboBoxModule,
    ErrorMessagePipe,
    LoaderModule,
    DateInputModule,
  ],
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDialogComponent extends DialogContentBase implements OnInit {
  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vmSignal = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected vm$ = this.store.select(selectCreateOpportunityDialogViewModel);

  protected readonly xIcon = xIcon;

  protected opportunityForm = this.fb.group({
    organisationId: [<string | null>null, [Validators.required]],
    opportunityTagId: [<string | null>null, [Validators.required]],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
    underNda: [null],
    ndaTerminationDate: [null],
  });

  protected defaultFundingRound = {
    id: null,
    name: 'Choose from list',
  };

  protected readonly ndaDropdown = {
    data: [
      {
        name: 'Yes (Open)',
        id: 'Yes (Open)',
      },
      {
        name: 'Yes (Closed)',
        id: 'Yes (Closed)',
      },
      {
        name: 'No',
        id: 'No',
      },
    ],
    default: {
      name: 'Choose from list',
      id: null,
    },
  };

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          'opportunity-create': null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  public ngOnInit(): void {
    if (this.vmSignal().organisationId) {
      this.opportunityForm.controls.organisationId.setValue(
        this.vmSignal().organisationId!,
      );
      this.opportunityForm.controls.organisationId.disable();
    }
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.createOpportunity({
        payload: {
          ...this.opportunityForm.getRawValue(),
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.createOpportunitySuccess), take(1))
      .subscribe((data) => {
        if (data.data.organisation.id) {
          this.store.dispatch(
            OrganisationsActions.addOpportunityToOrganisation({
              id: data.data.organisation.id,
              opportunityId: data.data.id,
              opportunity: data.data,
            }),
          );
        }
        this.dialog?.close();
      });
  }
}
