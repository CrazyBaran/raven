import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectDeleteShortlistViewModel } from './delete-shortlist-dialog.selectors';

@Component({
  selector: 'app-delete-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './delete-shortlist-dialog.component.html',
  styleUrls: ['./delete-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.deleteShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectDeleteShortlistViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected delete(): void {
    this.store.dispatch(
      ShortlistsActions.deleteShortlist({ id: this.vm().id }),
    );

    this.actions$
      .pipe(
        ofType(
          ShortlistsActions.deleteShortlistSuccess,
          ShortlistsActions.deleteShortlistFailure,
        ),
        take(1),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
