import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import {
  ControlHasChangesPipe,
  ControlInvalidPipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import {
  ShortlistForm,
  ShortlistFormComponent,
} from '@app/client/shortlists/ui';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import { first } from 'rxjs';
import { UPDATE_SHORTLIST_FORM_FN } from '../update-shortlist-form.token';
import {
  selectUpdateShortlistViewModel,
  selectUpdatingShortlist,
} from './update-shortlist-dialog.selectors';

@Component({
  selector: 'app-update-shortlist-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ShortlistFormComponent,
    LoaderModule,
    ControlHasChangesPipe,
    AsyncPipe,
    RxPush,
    ControlInvalidPipe,
  ],
  templateUrl: './update-shortlist-dialog.component.html',
  styleUrls: ['./update-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.updateShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectUpdateShortlistViewModel);
  protected currentShortlist$ = this.store.select(selectUpdatingShortlist);

  protected updateForm: ShortlistForm;

  public constructor(dialog: DialogRef) {
    super(dialog);
    const updateFormFn = inject(UPDATE_SHORTLIST_FORM_FN);

    this.currentShortlist$.pipe(first((x) => !!x)).subscribe((shortlist) => {
      this.updateForm = updateFormFn({
        name: shortlist!.name,
        description: shortlist!.description,
      });
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    this.store.dispatch(
      ShortlistsActions.updateShortlist({
        id: this.vm().id,
        changes: {
          name: this.updateForm.value.name ?? '',
          description: this.updateForm.value.description ?? '',
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ShortlistsActions.updateShortlistSuccess,
          ShortlistsActions.updateShortlistFailure,
        ),
        first(),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
