import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogUtil } from '@app/client/shared/util';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './reopen-opportunity-dialog.selectors';

@Component({
  selector: 'app-reopen-opportunity-dialog',
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
  ],
  templateUrl: './reopen-opportunity-dialog.component.html',
  styleUrls: ['./reopen-opportunity-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReopenOpportunityDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected form = inject(FormBuilder).group({
    companyName: '',
    round: '',
    option: 'duplicate' as 'duplicate' | 'existing',
    newName: '',
  });

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogUtil.queryParams.reopenOpportunity]: null,
        },
        queryParamsHandling: 'merge',
      });
    });
    this.store.dispatch(
      OpportunitiesActions.getOpportunityDetails({
        id: this.vm().opportunityId!,
      }),
    );

    this.form.controls.option.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((option) => {
        if (option === 'duplicate') {
          this.form.controls.newName.setValidators(Validators.required);
          this.form.controls.newName.enable();
        } else {
          this.form.controls.newName.clearValidators();
          this.form.controls.newName.disable();
        }
      });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.reopenOpportunity({
        id: this.vm().opportunityId!,
        versionName: this.form.controls.newName.value!,
        reopenAndDuplicate: this.form.controls.option.value === 'duplicate',
      }),
    );

    this.actions$
      .pipe(
        ofType(
          OrganisationsActions.updateOrganisationSuccess,
          OrganisationsActions.updateOrganisationFailure,
        ),
        take(1),
      )
      .subscribe((_data) => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().organisation.id!,
          }),
        );
        this.dialog?.close();
      });

    this.actions$
      .pipe(
        ofType(
          OpportunitiesActions.reopenOpportunitySuccess,
          OpportunitiesActions.reopenOpportunityFailure,
        ),
        take(1),
      )
      .subscribe((data) => {
        this.store.dispatch(
          OrganisationsActions.updateOrganisation({
            id: this.vm().organisation.id!,
            changes: {
              companyStatus: null,
            },
          }),
        );
      });
  }
}
