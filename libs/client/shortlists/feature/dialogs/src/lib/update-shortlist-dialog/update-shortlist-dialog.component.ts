import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  DialogQueryParams,
  DynamicDialogContentBase,
} from '@app/client/shared/shelf';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { selectUpdateShortlistViewModel } from './update-shortlist-dialog.selectors';

@Component({
  selector: 'app-update-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './update-shortlist-dialog.component.html',
  styleUrls: ['./update-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogQueryParams.updateShortlist;

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectUpdateShortlistViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {}
}
