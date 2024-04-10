import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DynamicDialogContentBase } from '@app/client/shared/ui-directives';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { selectRemoveShortlistFromOrganisationViewModel } from './remove-shortlist-from-organisation-dialog.selectors';

@Component({
  selector: 'app-delete-from-shortlist-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, LoaderModule],
  templateUrl: './remove-shortlist-from-organisation-dialog.component.html',
  styleUrls: ['./remove-shortlist-from-organisation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveShortlistFromOrganisationDialogComponent extends DynamicDialogContentBase {
  public readonly route = 'remove-shortlist-from-organisation';
  public override closeOnActions = [
    ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess,
    ShortlistsActions.bulkRemoveOrganisationsFromShortlistFailure,
  ];

  protected vm = this._store.selectSignal(
    selectRemoveShortlistFromOrganisationViewModel,
  );

  protected delete(): void {
    this._store.dispatch(
      ShortlistsActions.bulkRemoveOrganisationsFromShortlist({
        data: {
          shortlistId: this.vm().shortlistId!,
          organisations: [this.vm().organisationId!],
        },
      }),
    );
  }
}
