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
import { DialogQueryParams } from '@app/client/shared/shelf';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectCreateOpportunityDialogViewModel } from './reopen-opportunity-dialog.selectors';

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [
    DialogModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    RadioButtonModule,
    ButtonModule,
    LoaderModule,
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

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogQueryParams.reopenOpportunity]: null,
        },
        queryParamsHandling: 'merge',
      });
    });
    this.store.dispatch(
      OpportunitiesActions.getOpportunityDetails({
        id: this.vm().opportunityId!,
      }),
    );
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.store.dispatch(
      OpportunitiesActions.reopenOpportunity({
        id: this.vm().opportunityId!,
      }),
    );

    this.actions$
      .pipe(ofType(OpportunitiesActions.reopenOpportunitySuccess), take(1))
      .subscribe((data) => {
        this.dialog?.close();
      });
  }
}
