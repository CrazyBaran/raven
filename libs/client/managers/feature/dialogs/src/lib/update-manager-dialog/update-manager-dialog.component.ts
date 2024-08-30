import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { ManagerForm, ManagerFormComponent } from '@app/client/managers/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ManagersActions } from '@app/client/managers/state';
import { UPDATE_MANAGER_FORM_FN } from '@app/client/managers/utils';
import { LoaderComponent } from '@app/client/shared/ui';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import {
  ControlHasChangesPipe,
  ControlInvalidPipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import { first } from 'rxjs';
import {
  selectUpdateManagerViewModel,
  selectUpdatingManager,
} from './update-manager-dialog.selectors';

@Component({
  selector: 'app-update-manager-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    ControlHasChangesPipe,
    AsyncPipe,
    RxPush,
    ControlInvalidPipe,
    ManagerFormComponent,
    LoaderComponent,
  ],
  templateUrl: './update-manager-dialog.component.html',
  styleUrls: ['./update-manager-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateManagerDialogComponent extends DynamicDialogContentBase {
  public readonly route = DialogUtil.queryParams.updateManager;

  protected readonly store = inject(Store);
  protected readonly actions$ = inject(Actions);

  protected readonly vm = this.store.selectSignal(selectUpdateManagerViewModel);
  protected readonly curentManager$ = this.store.select(selectUpdatingManager);

  protected updateForm: ManagerForm;

  public constructor(dialog: DialogRef) {
    super(dialog);
    const updateFormFn = inject(UPDATE_MANAGER_FORM_FN);

    this.store.dispatch(
      ManagersActions.getManagerIfNotLoaded({ id: this.vm().id }),
    );

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['industry'],
      }),
    );

    this.curentManager$.pipe(first((x) => !!x)).subscribe((manager) => {
      this.updateForm = updateFormFn(manager!);
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const rawValue = this.updateForm.getRawValue();

    this.store.dispatch(
      ManagersActions.updateManager({
        id: this.vm().id,
        changes: {
          description: rawValue.description ?? '',
          strategy: rawValue.strategy ?? '',
          avgCheckSize: rawValue.avgCheckSize ?? undefined,
          avgCheckSizeCurrency: rawValue.avgCheckSizeCurrency ?? undefined,
          aum: rawValue.aum ?? undefined,
          aumCurrency: rawValue.aumCurrency ?? undefined,
          geography: rawValue.geography?.join(', ') ?? '',
          industryTags: rawValue.industryTags?.map((el) => el.id) ?? [],
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ManagersActions.updateManagerSuccess,
          ManagersActions.updateManagerFailure,
        ),
        first(),
      )
      .subscribe(() => this.dialog.close());
  }
}
