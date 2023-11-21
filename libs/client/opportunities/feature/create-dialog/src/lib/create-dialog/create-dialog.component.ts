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
import { TagsActions } from '@app/client/tags/state';
import { TemplateActions } from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
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

  protected vmSignal = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected vm$ = this.store.select(selectCreateOpportunityDialogViewModel);

  protected readonly xIcon = xIcon;

  protected opportunityForm = this.fb.group({
    organisationId: [null, [Validators.required]],
    opportunityTagId: [null, [Validators.required]],
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

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'company'],
      }),
    );

    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    if (!this.vmSignal().templateId) {
      throw new Error('Template id is not defined');
    }
    this.store.dispatch(
      OpportunitiesActions.createOpportunity({
        payload: {
          ...this.opportunityForm.getRawValue(),
          workflowTemplateId: this.vmSignal().templateId,
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
            }),
          );
        }
        this.dialog?.close();
      });
  }
}