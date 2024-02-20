import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  DialogQueryParams,
  DynamicDialogContentBase,
} from '@app/client/shared/shelf';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { selectDeleteShortlistViewModel } from './delete-shortlist-dialog.selectors';

@Component({
  selector: 'app-delete-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './delete-shortlist-dialog.component.html',
  styleUrls: ['./delete-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogQueryParams.deleteShortlist;

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectDeleteShortlistViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {}
}
