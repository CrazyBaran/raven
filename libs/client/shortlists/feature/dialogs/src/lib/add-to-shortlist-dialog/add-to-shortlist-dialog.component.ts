import {
  ChangeDetectionStrategy,
  Component,
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
import {
  DialogQueryParams,
  DynamicDialogContentBase,
} from '@app/client/shared/shelf';
import { ShortlistFormComponent } from '@app/client/shortlists/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { selectAddToShortlistViewModel } from './add-to-shortlist-dialog.selectors';

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
  ],
  templateUrl: './add-to-shortlist-dialog.component.html',
  styleUrls: ['./add-to-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogQueryParams.addToShortlist;
  protected store = inject(Store);
  protected form = inject(FormBuilder).group({
    id: [null, [Validators.required]],
  });

  protected createShortlistForm = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(1000)]],
  });

  protected vm = this.store.selectSignal(selectAddToShortlistViewModel);

  protected mode = signal<'create' | 'add'>('add');

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {}

  createShortlist() {
    // create
    this.switchToAddToShortlistMode();
  }

  protected switchToAddToShortlistMode(): void {
    this.mode.set('add');
  }

  protected switchToCreateShortlistMode(): void {
    this.mode.set('create');
  }
}
