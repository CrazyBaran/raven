import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FilesActions } from '@app/client/files/feature/state';
import { TagComponent } from '@app/client/shared/ui';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { RxPush } from '@rx-angular/template/push';
import * as _ from 'lodash';
import { startWith } from 'rxjs';
import { selectUpdateFileTagsDialogViewModel } from './file-tags-update-dialog.selectors';

export const injectActionCallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: ActionCreator<any, any> | ActionCreator<any, any>[],
  callback: () => void,
): void => {
  const actions$ = inject(Actions);

  actions$
    .pipe(ofType(..._.castArray(actions)), takeUntilDestroyed())
    .subscribe(() => callback());
};

export const toSignalValue = <TValue>(
  control: FormControl<TValue>,
): Signal<TValue | undefined> => {
  const value$ = control.valueChanges.pipe(startWith(control.value));

  return toSignal(value$);
};

@Component({
  selector: 'app-file-tags-update-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormFieldModule,
    MultiSelectModule,
    TextBoxModule,
    TagComponent,
    ButtonModule,
    LabelModule,
    ControlInvalidPipe,
    LoaderModule,
    RxPush,
  ],
  templateUrl: './file-tags-update-dialog.component.html',
  styleUrl: './file-tags-update-dialog.component.scss',
})
export class FileTagsUpdateDialogComponent {
  public fb = inject(FormBuilder);
  public store = inject(Store);

  public opportunityId = input<string>();
  public activeFile = input.required<{ id: string; name: string }>();
  public activeFileTags = input.required<{ id: string; name: string }[]>();

  public dialogClose = output();

  public vm = this.store.selectSignal(selectUpdateFileTagsDialogViewModel);

  public form = this.fb.group({
    name: [{ value: '', disabled: true }],
    tags: [[] as string[]],
  });

  public tagsValue = toSignalValue(this.form.controls.tags);

  public selectedTags = computed(
    () =>
      this.tagsValue()
        ?.map((id) => this.vm().tabTags.find((tab) => tab.id === id))
        .filter(Boolean),
  );

  public constructor() {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['tab'] }),
    );

    effect(() => {
      this.form.setValue({
        name: this.activeFile()?.name ?? '',
        tags: this.activeFileTags()?.map(({ id }) => id) ?? [],
      });
    });

    injectActionCallback(FilesActions.updateFileTagsSuccess, () =>
      this.dialogClose.emit(),
    );
  }

  public removeTag(id: string): void {
    const tags = this.form.controls.tags.value ?? [];
    this.form.controls.tags.setValue(tags.filter((tagId) => tagId !== id));
  }

  protected submit(): void {
    this.store.dispatch(
      FilesActions.updateFileTags({
        opportunityId: this.opportunityId()!,
        id: this.activeFile()?.id,
        tags: this.form.controls.tags.value ?? [],
      }),
    );
  }
}
