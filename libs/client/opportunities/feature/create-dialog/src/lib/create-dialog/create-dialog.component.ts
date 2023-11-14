import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogsModule,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  RadioButtonModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { xIcon } from '@progress/kendo-svg-icons';

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
  ],
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDialogComponent extends DialogContentBase {
  protected fb = inject(FormBuilder);
  protected store = inject(Store);

  protected readonly xIcon = xIcon;

  protected opportunityForm = this.fb.group({
    companyName: [''],
    fundingRound: [null],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
  });

  protected defaultFundingRound = {
    id: null,
    text: 'Choose from list',
  };

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    // this.store.dispatch(
    //   OpportunitiesActions.createOpportunity({
    //     opportunity: this.opportunityForm.value,
    //   }),
    // );
    this.dialog.close();
  }
}
