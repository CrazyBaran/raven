import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe } from '@angular/common';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import {
  ControlInvalidPipe,
  ControlStatePipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ShortlistFormComponent } from '@app/client/shortlists/ui';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import { SHORTLIST_FORM, provideShortlistForm } from '../shortlist-form.token';
import { selectCreateShortlistViewModel } from './create-shortlist-dialog.selectors';

@Component({
  selector: 'app-create-shortlist-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ShortlistFormComponent,
    LoaderModule,
    ControlStatePipe,
    AsyncPipe,
    ControlInvalidPipe,
  ],
  templateUrl: './create-shortlist-dialog.component.html',
  styleUrls: ['./create-shortlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideShortlistForm],
})
export class CreateShortlistDialogComponent extends DynamicDialogContentBase {
  public route = DialogUtil.queryParams.createShortlist;

  protected store = inject(Store);
  protected actions$ = inject(Actions);

  protected vm = this.store.selectSignal(selectCreateShortlistViewModel);

  protected form = inject(SHORTLIST_FORM);

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    this.store.dispatch(
      ShortlistsActions.createShortlist({
        data: {
          name: this.form.value.name!,
          description: this.form.value.description!,
        },
      }),
    );

    this.actions$
      .pipe(ofType(ShortlistsActions.createShortlistSuccess), take(1))
      .subscribe((response) => {
        this.dialog.close();
        this.router.navigate(['companies', 'shortlists', response.data.id]);
      });

    this.dialog.close();
  }
}
