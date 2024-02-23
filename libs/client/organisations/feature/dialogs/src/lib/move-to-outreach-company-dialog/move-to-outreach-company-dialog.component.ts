import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationsActions } from '@app/client/organisations/state';

import { DialogUtil } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { first } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './move-to-outreach-company-dialog.selectors';

@Component({
  selector: 'app-move-to-outreach-company-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './move-to-outreach-company-dialog.component.html',
  styleUrls: ['./move-to-outreach-company-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveToOutreachCompanyDialogComponent extends DialogContentBase {
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
          [DialogUtil.queryParams.moveToOutreachCompany]: null,
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
      OpportunitiesActions.createOpportunity({
        payload: {
          organisationId: this.vm().organisationId!,
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.createOpportunitySuccess), first())
      .subscribe(() => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().organisationId,
          }),
        );
        this.dialog.close();
      });
  }
}
