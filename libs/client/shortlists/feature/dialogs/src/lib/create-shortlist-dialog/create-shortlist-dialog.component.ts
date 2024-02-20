import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormBuilder, Validators } from '@angular/forms';
import {
  DialogQueryParams,
  DynamicDialogContentBase,
} from '@app/client/shared/shelf';
import { ShortlistFormComponent } from '@app/client/shortlists/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { selectCreateShortlistViewModel } from './create-shortlist-dialog.selectors';

const MAX_DESCRIPTION_LENGTH = 1000;

@Component({
  selector: 'app-create-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, ShortlistFormComponent],
  templateUrl: './create-shortlist-dialog.component.html',
  styleUrls: ['./create-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogQueryParams.createShortlist;

  protected store = inject(Store);
  protected vm = this.store.selectSignal(selectCreateShortlistViewModel);
  protected maxDescriptionLength = MAX_DESCRIPTION_LENGTH;

  protected form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(this.maxDescriptionLength)]],
  });

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {}
}
