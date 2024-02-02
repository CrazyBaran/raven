import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogsModule } from '@progress/kendo-angular-dialog';
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
import { LoaderComponent } from '@app/client/shared/ui';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { xIcon } from '@progress/kendo-svg-icons';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { first, map, take } from 'rxjs';
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
    LoaderComponent,
    RxIf,
  ],
  templateUrl: './create-opportunity-dialog.component.html',
  styleUrls: ['./create-opportunity-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOpportunityDialogComponent implements OnInit {
  @Output() public onCancel = new EventEmitter<unknown>();

  @Output() public onSubmit = new EventEmitter<unknown>();

  protected fb = inject(FormBuilder);

  protected store = inject(Store);

  protected actions$ = inject(Actions);

  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);

  protected vmSignal: any;

  protected vm$: any;

  protected opporunityDetails$: any;
  protected readonly xIcon = xIcon;

  protected opportunityForm = this.fb.group({
    organisationId: [{ value: null, disabled: true }, Validators.required],
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

  @Input() public set params(value: {
    opportunityId: string;
    organisationId: string;
  }) {
    this.vmSignal = this.store.selectSignal(
      selectCreateOpportunityDialogViewModel(value),
    );
    this.vm$ = this.store.select(selectCreateOpportunityDialogViewModel(value));
    this.opporunityDetails$ = this.vm$.pipe(
      map((data: any) => data.opportunityDetails),
      first((data) => !!data),
    );

    this.opporunityDetails$ = this.vm$.pipe(
      map((data: any) => data.opportunityDetails),
      first((data) => !!data),
    );
  }

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'company'],
      }),
    );

    this.opporunityDetails$?.subscribe((data: any) => {
      // fix pathValue typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.opportunityForm.patchValue({
        ..._.pickBy(data, (v, key) =>
          Object.keys(this.opportunityForm.controls).includes(key),
        ),
        opportunityTagId: data?.tag?.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });
  }

  protected onDialogClose(): void {
    this.onCancel.emit();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.updateOpportunity({
        id: this.vmSignal()!.opportunityDetails!.id,
        changes: {
          ...this.opportunityForm.getRawValue(),
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
