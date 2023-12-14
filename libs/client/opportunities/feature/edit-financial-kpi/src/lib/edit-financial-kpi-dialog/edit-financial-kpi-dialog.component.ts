import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
} from '@angular/core';
import { FormRecord, ReactiveFormsModule } from '@angular/forms';
import {
  ControlInjectorPipe,
  DynamicControlResolver,
  comparatorFn,
} from '@app/client/shared/dynamic-form-util';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogsModule,
} from '@progress/kendo-angular-dialog';

import { KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesActions } from '@app/client/notes/data-access';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { delay, filter, take, tap } from 'rxjs/operators';
import {
  selectCreateOpportunityDialogViewModel,
  selectEditFinancialDynamicControls,
} from './edit-financial-kpi.selectors';

@Directive()
export abstract class DynamicDialogContentBase extends DialogContentBase {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected abstract dialogParam: string;

  public constructor(dialog: DialogRef) {
    super(dialog);

    this.dialog.dialog?.onDestroy(() => {
      this.clearDialogQueryParam();
    });

    this.activatedRoute.queryParams
      .pipe(
        delay(250),
        takeUntilDestroyed(),
        filter((params) => !(this.dialogParam in params)),
        take(1),
        tap(() => this.dialog.close()),
      )
      .subscribe();
  }

  protected clearDialogQueryParam(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [this.dialogParam]: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}

@Component({
  selector: 'app-edit-financial-kpi-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DialogsModule,
    LoaderModule,
    ControlInjectorPipe,
    RxLet,
    NgComponentOutlet,
    KeyValuePipe,
  ],
  templateUrl: './edit-financial-kpi-dialog.component.html',
  styleUrls: ['./edit-financial-kpi-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFinancialKpiDialogComponent extends DynamicDialogContentBase {
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected controlResolver = inject(DynamicControlResolver);

  protected override dialogParam = 'edit-financial-kpi';
  protected kpiForm = new FormRecord({});

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  protected visibleControls = toSignal(
    this.store.select(selectEditFinancialDynamicControls),
  );

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.store.dispatch(
      NotesActions.updateNote({
        noteId: this.vm().opportunityNote.id,
        data: {
          name: this.vm().opportunityNote.name,
          fields: _.chain(
            this.kpiForm.value as Record<string, Record<string, unknown>>,
          )
            .map((value, id) =>
              _.chain(value)
                .map((value, key) => ({
                  id: key,
                  value,
                }))
                .value(),
            )
            .flatMap()
            .value(),
          tagIds: this.vm().opportunityNote.tags.map((x) => x.id),
          origin: this.vm().opportunityNote,
          opportunityId: this.vm().opportunityId,
        },
      }),
    );
    this.actions$
      .pipe(ofType(NotesActions.updateNoteSuccess), take(1))
      .subscribe((data) => {
        this.dialog?.close();
      });
  }

  protected readonly comparatorFn = comparatorFn;
}
