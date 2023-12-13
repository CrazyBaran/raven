import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormRecord, ReactiveFormsModule } from '@angular/forms';
import {
  comparatorFn,
  ControlInjectorPipe,
  DynamicControl,
  DynamicControlResolver,
  DynamicGroupControl,
  ErrorMessagePipe,
} from '@app/client/shared/dynamic-form-util';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogsModule,
} from '@progress/kendo-angular-dialog';
import {
  ComboBoxModule,
  DropDownListModule,
} from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  RadioButtonModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

import { ActivatedRoute, Router } from '@angular/router';
import { NotesActions } from '@app/client/notes/data-access';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxFor } from '@rx-angular/template/for';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { selectCreateOpportunityDialogViewModel } from './edit-financial-kpi.selectors';

@Component({
  selector: 'app-edit-financial-kpi-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    DropDownListModule,
    RadioButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DialogsModule,
    RxLet,
    ComboBoxModule,
    ErrorMessagePipe,
    LoaderModule,
    DateInputModule,
    ControlInjectorPipe,
    RxFor,
  ],
  templateUrl: './edit-financial-kpi-dialog.component.html',
  styleUrls: ['./edit-financial-kpi-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFinancialKpiDialogComponent
  extends DialogContentBase
  implements OnInit
{
  protected kpiForm = new FormRecord({});
  protected fb = inject(FormBuilder);
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected controlResolver = inject(DynamicControlResolver);

  protected vm = this.store.selectSignal(
    selectCreateOpportunityDialogViewModel,
  );

  protected visibleControls = computed(
    (): Record<string, DynamicControl> => {
      const fields = this.vm().fieldGroups;

      return _.chain(fields)
        .map(
          (group): DynamicGroupControl => ({
            ...group,
            type: 'group',
            controls: _.chain(group.noteFields)
              .map(
                (control): DynamicControl => ({
                  ...control,
                  type: 'numeric',
                  value: control.value,
                }),
              )
              .mapKeys(({ id }) => id)
              .value(),
          }),
        )
        .mapKeys(({ id }) => id)
        .value();
    },
    { equal: _.isEqual },
  );

  public constructor(dialog: DialogRef) {
    super(dialog);
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          'edit-financial-kpi': null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'company'],
      }),
    );
  }

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
