import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ShortlistFormComponent } from '@app/client/shortlists/ui';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import * as _ from 'lodash';
import { take } from 'rxjs';
import { SHORTLIST_FORM, provideShortlistForm } from '../shortlist-form.token';
import { selectAddToShortlistViewModel } from './add-to-shortlist-dialog.selectors';
import { addToShortlistDialogStore } from './add-to-shortlist-dialog.store';

@Component({
  selector: 'app-add-to-shortlist-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    ReactiveFormsModule,
    DropDownListModule,
    RouterLink,
    ShortlistFormComponent,
    LoaderModule,
    MultiSelectModule,
  ],
  templateUrl: './add-to-shortlist-dialog.component.html',
  styleUrls: ['./add-to-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideShortlistForm, addToShortlistDialogStore],
})
export class AddToShortlistDialogComponent extends DynamicDialogContentBase {
  public signalStore = inject(addToShortlistDialogStore);

  public route = DialogUtil.queryParams.addToShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected form = inject(FormBuilder).group({
    shortlistsIds: [<string[]>[], [Validators.required]],
  });

  protected createShortlistForm = inject(SHORTLIST_FORM);

  protected vm = this.store.selectSignal(selectAddToShortlistViewModel);

  protected mode = signal<'create' | 'add'>('add');

  public constructor(dialog: DialogRef) {
    super(dialog);

    const { filter, organisations } = this.signalStore;
    this.signalStore.loadByFilter(filter);
    this.signalStore.loadAddedShortlists(organisations);

    effect(() => {
      const addedShortlists = this.signalStore.addedShortlists();
      if (addedShortlists.length) {
        this.form.controls.shortlistsIds.setValue(
          _.uniq([
            ...addedShortlists.map(({ id }) => id),
            ...(this.form.controls.shortlistsIds.value ?? []),
          ]),
        );
      }
    });
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const shortlistsIds = this.form.controls.shortlistsIds.value;
    const ommitedIds = this.signalStore.addedShortlists().map(({ id }) => id);

    this.store.dispatch(
      ShortlistsActions.bulkAddOrganisationsToShortlist({
        data: {
          shortlistsIds: shortlistsIds!.filter(
            (id) => !ommitedIds.includes(id),
          ),
          organisationsIds: this.vm().organisations,
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(ShortlistsActions.bulkAddOrganisationsToShortlistSuccess),
        take(1),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }

  protected createShortlist(): void {
    this.store.dispatch(
      ShortlistsActions.createShortlist({
        data: {
          name: this.createShortlistForm.controls.name.value!,
          description: this.createShortlistForm.controls.description.value!,
        },
      }),
    );

    this.actions$
      .pipe(ofType(ShortlistsActions.createShortlistSuccess), take(1))
      .subscribe(({ data }) => {
        this.form.controls.shortlistsIds.setValue([
          ...(this.form.controls.shortlistsIds.value ?? []),
          data.id,
        ]);
        this.signalStore.reloadShortlists();
        this.switchToAddToShortlistMode();
      });
  }

  protected switchToAddToShortlistMode(): void {
    this.mode.set('add');
  }

  protected switchToCreateShortlistMode(): void {
    this.createShortlistForm.reset();
    this.mode.set('create');
  }

  protected onFilterChange($event: string): void {
    this.signalStore.updateFilter($event);
  }
}
