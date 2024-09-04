import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ManagersActions } from '@app/client/managers/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { DialogUtil } from '@app/client/shared/util';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { first } from 'rxjs';
import { selectRemoveContactViewModel } from './remove-contact-dialog.selectors';

@Component({
  selector: 'app-remove-contact-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './remove-contact-dialog.component.html',
  styleUrls: ['./remove-contact-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveContactDialogComponent extends DynamicDialogContentBase {
  public readonly route = DialogUtil.queryParams.removeManagerContact;

  protected readonly store = inject(Store);
  protected readonly actions$ = inject(Actions);

  protected readonly vm = this.store.selectSignal(selectRemoveContactViewModel);

  protected remove(): void {
    this.store.dispatch(
      ManagersActions.removeManagerContact({
        id: this.vm().id!,
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ManagersActions.removeManagerContactSuccess,
          ManagersActions.removeManagerContactFailure,
        ),
        first(),
      )
      .subscribe(() => this.dialog.close());
  }
}
