/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectMoveToMetCompanyDialogViewModel } from './move-to-met-company-dialog.selectors';

@Component({
  selector: 'app-move-to-met-company-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './move-to-met-company-dialog.component.html',
  styleUrls: ['./move-to-met-company-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveToMetCompanyDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vm = this.store.selectSignal(selectMoveToMetCompanyDialogViewModel);

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogUtil.queryParams.moveToMetCompany]: null,
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
      OpportunitiesActions.updateOpportunity({
        id: this.vm().opportunityId!,
        changes: {
          pipelineStageId: this.vm()?.metPipelineId,
        },
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunitySuccess), take(1))
      .subscribe(() => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().currentOrganisation!.id!,
          }),
        );
        this.dialog?.close();
      });

    this.actions$
      .pipe(ofType(OpportunitiesActions.updateOpportunityFailure), take(1))
      .subscribe(() => {
        this.dialog?.close();
      });
  }
}
