import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { ContactForm, ContactFormComponent } from '@app/client/managers/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ManagersActions } from '@app/client/managers/state';
import { CREATE_CONTACT_FORM_FN } from '@app/client/managers/utils';
import { LoaderComponent } from '@app/client/shared/ui';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import {
  ControlHasChangesPipe,
  ControlInvalidPipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import { first } from 'rxjs';
import { selectCreateContactViewModel } from './create-contact-dialog.selectors';

@Component({
  selector: 'app-create-contact-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    ControlHasChangesPipe,
    AsyncPipe,
    RxPush,
    ControlInvalidPipe,
    ContactFormComponent,
    LoaderComponent,
  ],
  templateUrl: './create-contact-dialog.component.html',
  styleUrls: ['./create-contact-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateContactDialogComponent extends DynamicDialogContentBase {
  public readonly route = DialogUtil.queryParams.createManagerContact;

  protected readonly store = inject(Store);
  protected readonly actions$ = inject(Actions);

  protected readonly vm = this.store.selectSignal(selectCreateContactViewModel);

  protected createForm: ContactForm;

  public constructor(dialog: DialogRef) {
    super(dialog);
    const createFormFn = inject(CREATE_CONTACT_FORM_FN);
    this.createForm = createFormFn();
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const rawValue = this.createForm.getRawValue();

    this.store.dispatch(
      ManagersActions.createManagerContact({
        id: this.vm().id!,
        data: {
          name: rawValue.name ?? '',
          position: rawValue.position ?? '',
          relationStrength: rawValue.relationStrength ?? null,
          email: rawValue.email ?? '',
          linkedin: rawValue.linkedin ?? '',
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ManagersActions.createManagerContactSuccess,
          ManagersActions.createManagerContactFailure,
        ),
        first(),
      )
      .subscribe(() => this.dialog.close());
  }
}
