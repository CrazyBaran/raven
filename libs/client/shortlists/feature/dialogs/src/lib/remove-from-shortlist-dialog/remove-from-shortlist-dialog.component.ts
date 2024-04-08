import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { selectDeleteShortlistViewModel } from './remove-from-shortlist-dialog.selectors';

@Component({
  selector: 'app-delete-from-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './remove-from-shortlist-dialog.component.html',
  styleUrls: ['./remove-from-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveFromShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.removeFromShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectDeleteShortlistViewModel);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected delete(): void {
    this.store.dispatch(
      ShortlistsActions.bulkRemoveOrganisationsFromShortlist({
        data: {
          shortlistId: this.vm().id,
          organisations: this.vm().organisations,
        },
      }),
    );

    this.actions$
      .pipe(
        ofType(
          ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
          ShortlistsActions.bulkRemoveOrganisationsFromShortlistFailure,
        ),
        take(1),
      )
      .subscribe(() => {
        this.dialog.close();
      });
  }
}
