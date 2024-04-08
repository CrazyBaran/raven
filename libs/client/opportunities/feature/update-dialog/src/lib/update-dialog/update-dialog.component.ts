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
import { LoaderComponent } from '@app/client/shared/ui';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { xIcon } from '@progress/kendo-svg-icons';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { first, map, take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './update-dialog.selectors';

@Component({
  selector: 'app-update-dialog',
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
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateDialogComponent extends DialogContentBase implements OnInit {
  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vmSignal = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );
  protected vm$ = this.store.select(selectCreateOpportunityDialogViewModel);
  protected opporunityDetails$ = this.vm$.pipe(
    map((data) => data.opportunityDetails),
    first((data) => !!data),
  );

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

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          'opportunity-edit': null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'company'],
      }),
    );

    this.opporunityDetails$.subscribe((data) => {
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
    this.dialog.close();
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
