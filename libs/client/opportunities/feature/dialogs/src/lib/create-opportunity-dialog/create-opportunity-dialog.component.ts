import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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

import { toObservable } from '@angular/core/rxjs-interop';
import {
  DealTeamPickerComponent,
  OpportunityForm,
  OpportunityFormComponent,
} from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import { first, switchMap, take } from 'rxjs';
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
export class CreateOpportunityDialogComponent
  extends DynamicDialogContentBase
  implements OnInit
{
  public readonly route = 'create-opportunity';

  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vmSignal = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected vm$ = this.store.select(selectCreateOpportunityDialogViewModel);
  public userDetails$ = toObservable(this.vmSignal).pipe(
    switchMap(() => this.store.select(tagsQuery.selectCurrentUserTag)),
    first((data) => !!data),
  );
  protected opportunityForm: OpportunityForm = this.fb.group({
    organisationId: [''],
    opportunityTagId: [<string | null>null, [Validators.required]],
    name: [<string | null>''],
    description: [<string | null | undefined>undefined],
    roundSize: [''],
    valuation: [''],
    proposedInvestment: [''],
    positioning: ['lead'],
    timing: [''],
    underNda: [null as string | null],
    ndaTerminationDate: [null as string | null],
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

  public constructor(dialog: DialogRef) {
    super(dialog);

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
  }

  ngOnInit(): void {
    this.userDetails$?.subscribe((data) => {
      const prepopuplatedOwner = data?.userId ? [data.userId] : [];
      this.opportunityForm?.patchValue({
        team: {
          owners: prepopuplatedOwner,
          members: [],
        },
      });
    });
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

    this.actions$
      .pipe(
        ofType(
          OrganisationsActions.updateOrganisationSuccess,
          OrganisationsActions.updateOrganisationFailure,
        ),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.opportunityForm.controls.organisationId.value!,
          }),
        );
      });
  }
}
