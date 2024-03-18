/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrganisationsActions } from '@app/client/organisations/state';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import { OnErrorDirective } from '@app/client/shared/ui-directives';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  FormFieldModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { RxPush } from '@rx-angular/template/push';
import { take } from 'rxjs';
import { selectUpdateOrganisationDescriptionViewModel } from './update-organisation-description.selectors';

@Component({
  selector: 'app-update-organisation-description-dialog',
  standalone: true,
  imports: [
    DialogModule,
    FormFieldModule,
    ReactiveFormsModule,
    ButtonModule,
    LoaderModule,
    ControlInvalidPipe,
    RxPush,
    TextAreaModule,
    OnErrorDirective,
    TextBoxModule,
    LabelModule,
  ],
  templateUrl: './update-organisation-description-dialog.component.html',
  styleUrls: ['./update-organisation-description-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOrganisationDescriptionDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.updateOrganisationDescription;

  protected store = inject(Store);

  protected actions$ = inject(Actions);

  protected maxDescriptionLength = 1000;

  protected vm = this.store.selectSignal(
    selectUpdateOrganisationDescriptionViewModel,
  );

  protected form = inject(FormBuilder).group({
    name: [
      {
        value: '',
        disabled: true,
      },
      [],
    ],
    description: ['', []],
  });

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    this.store.dispatch(
      OrganisationsActions.updateOrganisationDescription({
        id: this.vm().organisationId!,
        description: this.form.controls.description.value!,
      }),
    );

    this.actions$
      .pipe(
        ofType(OrganisationsActions.updateOrganisationDescriptionSuccess),
        take(1),
      )
      .subscribe((response) => {
        this.dialog.close();
      });
  }
}
