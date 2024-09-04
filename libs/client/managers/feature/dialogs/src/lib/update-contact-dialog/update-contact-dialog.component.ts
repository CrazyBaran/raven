import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { ContactForm, ContactFormComponent } from '@app/client/managers/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import {
  selectUpdateContactViewModel,
  selectUpdatingContact,
} from './update-contact-dialog.selectors';

@Component({
  selector: 'app-update-contact-dialog',
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
  templateUrl: './update-contact-dialog.component.html',
  styleUrls: ['./update-contact-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateContactDialogComponent extends DynamicDialogContentBase {
  public readonly route = DialogUtil.queryParams.updateManagerContact;

  protected readonly store = inject(Store);
  protected readonly actions$ = inject(Actions);

  protected readonly vm = this.store.selectSignal(selectUpdateContactViewModel);
  protected readonly currentContact$ = this.store.select(selectUpdatingContact);

  protected updateForm: ContactForm;

  public constructor(dialog: DialogRef) {
    super(dialog);
    const updateFormFn = inject(CREATE_CONTACT_FORM_FN);

    this.store.dispatch(
      ManagersActions.getManagerContact({ id: this.vm().id }),
    );

    this.currentContact$.pipe(takeUntilDestroyed()).subscribe((contact) => {
      this.updateForm = updateFormFn(contact!);
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const rawValue = this.updateForm.getRawValue();

    this.store.dispatch(
      ManagersActions.updateManagerContact({
        id: this.vm().id,
        changes: {
          name: rawValue.name ?? '',
          position: rawValue.position ?? '',
          relationStrength: rawValue.relationStrength ?? undefined,
          email: rawValue.email ?? '',
          linkedin: rawValue.linkedin ?? '',
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ManagersActions.updateManagerContactSuccess,
          ManagersActions.updateManagerContactFailure,
        ),
        first(),
      )
      .subscribe(() => this.dialog.close());
  }
}
