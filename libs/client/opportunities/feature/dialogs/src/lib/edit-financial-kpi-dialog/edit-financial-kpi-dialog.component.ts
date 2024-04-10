import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import {
  ControlInjectorPipe,
  DynamicControlResolver,
  comparatorFn,
} from '@app/client/shared/dynamic-form-util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogsModule } from '@progress/kendo-angular-dialog';

import { KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotesActions } from '@app/client/notes/state';
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import {
  selectCreateOpportunityDialogViewModel,
  selectEditFinancialDynamicControls,
} from './edit-financial-kpi.selectors';

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
  public readonly route = 'edit-financial-kpi';

  public override closeOnActions = [NotesActions.updateNoteSuccess];

  protected controlResolver = inject(DynamicControlResolver);

  protected kpiForm = new FormRecord<FormRecord<FormControl<number>>>({});

  protected vm = this._store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  protected visibleControls = toSignal(
    this._store.select(selectEditFinancialDynamicControls(this.kpiForm)),
  );

  protected readonly comparatorFn = comparatorFn;

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected onCreate(): void {
    this.kpiForm.value[''];
    this._store.dispatch(
      NotesActions.updateNote({
        noteId: this.vm().opportunityNote.id,
        data: {
          name: this.vm().opportunityNote.name,
          fields: _.chain(this.kpiForm.value)
            .map((value, id) =>
              _.chain(value)
                .map((value, key) => ({
                  id: key,
                  value:
                    value === null || value === undefined ? '' : String(value),
                }))
                .value(),
            )
            .flatMap()
            .value(),
          tagIds: this.vm().opportunityNote.tags.map((x) => x.id),
          companyOpportunityTags: [],
          origin: this.vm().opportunityNote,
          opportunityId: this.vm().opportunityId,
        },
      }),
    );
  }
}
