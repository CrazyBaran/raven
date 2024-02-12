import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CompanyStatus } from 'rvns-shared';
import { first } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './pass-company-dialog.selectors';

@Component({
  selector: 'app-pass-company-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './pass-company-dialog.component.html',
  styleUrls: ['./pass-company-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCompanyDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogQueryParams.passCompany]: null,
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

    this.actions$
      .pipe(ofType(OrganisationsActions.updateOrganisationSuccess), first())
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
