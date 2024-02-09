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

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectUpdateOpportunityStageViewModel } from './update-opportunity-stage-dialog.selectors';

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
    ReactiveFormsModule,
    DropDownListModule,
  ],
  templateUrl: './update-opportunity-stage-dialog.component.html',
  styleUrls: ['./update-opportunity-stage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOpportunityStageDialogComponent extends DialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected stageControl = new FormControl<string | null>(
    null,
    Validators.required,
  );

  protected vm = this.store.selectSignal(selectUpdateOpportunityStageViewModel);

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [DialogQueryParams.updateOpportunityStage]: null,
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

  protected submit(): void {
    this.store.dispatch(
      OpportunitiesActions.changeOpportunityPipelineStage({
        id: this.vm().opportunityId!,
        pipelineStageId: this.stageControl.value!,
      }),
    );

    this.actions$
      .pipe(
        ofType(OpportunitiesActions.changeOpportunityPipelineStageSuccess),
        take(1),
      )
      .subscribe((data) => {
        this.dialog?.close();
      });
  }
}
