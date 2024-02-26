import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ShortlistFormComponent } from '@app/client/shortlists/ui';
import { tapResponse } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  ItemDisabledFn,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  debounceTime,
  distinctUntilChanged,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { SHORTLIST_FORM, provideShortlistForm } from '../shortlist-form.token';
import { selectAddToShortlistViewModel } from './add-to-shortlist-dialog.selectors';

type AddToShortlistDialogState = {
  mode: 'create' | 'add';
  filter: string;
  shortlists: {
    id: string;
    name: string;
  }[];
  isLoading: boolean;
  organisations: string[];
};

const initialState: AddToShortlistDialogState = {
  mode: 'add',
  filter: '',
  shortlists: [],
  isLoading: false,
  organisations: [],
};

const MY_SHORTLIST_ITEM = {
  name: 'My Shortlist',
  id: 'my',
};

export const AddToShortlistDialogStore = signalStore(
  withState(initialState),

  withMethods((store, shortlistsService = inject(ShortlistsService)) => ({
    updateFilter(filter: string): void {
      patchState(store, { filter });
    },
    loadByFilter: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) =>
          shortlistsService.getShortlists({ query: query, take: 250 }).pipe(
            tapResponse({
              next: (response) => {
                const shortlists = [
                  MY_SHORTLIST_ITEM,
                  ...response.data!.items.filter(
                    ({ type }) => type === 'custom',
                  ),
                ];

                patchState(store, {
                  shortlists: shortlists,
                  isLoading: false,
                });
              },
              error: (error) => console.error('Error', error),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);

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
  providers: [provideShortlistForm, AddToShortlistDialogStore],
})
export class AddToShortlistDialogComponent
  extends DynamicDialogContentBase
  implements OnInit
{
  public signalStore = inject(AddToShortlistDialogStore);

  public route = DialogUtil.queryParams.addToShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected form = inject(FormBuilder).group({
    shortlistsIds: [<string[]>[MY_SHORTLIST_ITEM.id], [Validators.required]],
  });

  protected createShortlistForm = inject(SHORTLIST_FORM);

  protected vm = this.store.selectSignal(selectAddToShortlistViewModel);

  protected mode = signal<'create' | 'add'>('add');

  public ngOnInit(): void {
    const filter = this.signalStore.filter;
    this.signalStore.loadByFilter(filter);
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected itemDisabledFn: ItemDisabledFn = (item) => {
    return item.dataItem === MY_SHORTLIST_ITEM;
  };

  protected submit(): void {
    const shortlistsIds = this.form.controls.shortlistsIds.value;

    this.store.dispatch(
      ShortlistsActions.bulkAddOrganisationsToShortlist({
        data: {
          shortlistsIds:
            shortlistsIds?.filter((id) => id !== MY_SHORTLIST_ITEM.id) ?? [],
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

  public onFilterChange($event: string): void {
    this.signalStore.updateFilter($event);
  }
}
