import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
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

import {
  DealTeamPickerComponent,
  OpportunityForm,
  OpportunityFormComponent,
} from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { TagsActions } from '@app/client/tags/state';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import { take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './create-opportunity-dialog.selectors';

@Component({
  selector: 'app-create-opportunity-dialog',
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
    DealTeamPickerComponent,
    OpportunityFormComponent,
  ],
  templateUrl: './create-opportunity-dialog.component.html',
  styleUrls: ['./create-opportunity-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOpportunityDialogComponent extends DynamicDialogContentBase {
  public readonly route = 'create-opportunity';

  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vmSignal = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected vm$ = this.store.select(selectCreateOpportunityDialogViewModel);

  protected opportunityForm: OpportunityForm = this.fb.group({
    organisationId: [''],
    opportunityTagId: [<string | null>null, [Validators.required]],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
    underNda: [null as string | null],
    ndaTerminationDate: [null as string | null],
    team: this.fb.control<{
      owners: [];
      members: [];
    }>({
      owners: [],
      members: [],
    }),
  });

  public constructor(dialog: DialogRef) {
    super(dialog);

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
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

    this.actions$
      .pipe(ofType(OpportunitiesActions.createOpportunityFailure), take(1))
      .subscribe((data) => {
        this.dialog?.close();
      });
  }
}
