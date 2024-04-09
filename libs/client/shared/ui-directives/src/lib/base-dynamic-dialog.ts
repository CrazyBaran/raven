/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering */
import { Directive, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogParam } from '@app/client/shared/util';
import { selectQueryParams } from '@app/client/shared/util-router';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { debounceTime, take } from 'rxjs';

@Directive()
export abstract class DynamicDialogContentBase extends DialogContentBase {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected _actions$ = inject(Actions);
  protected _store = inject(Store);

  public abstract route: DynamicDialogParam;

  public closeOnActions?: ActionCreator<any, any>[];

  @HostBinding('class') public hostClass = 'flex h-full flex-col';

  public constructor(dialog: DialogRef) {
    super(dialog);

    // Clear route params which are used to open the dialog
    this.dialog.dialog?.onDestroy(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [this.route]: null,
        },
        queryParamsHandling: 'merge',
      });
    });

    setTimeout(() => {
      if (this.closeOnActions) {
        this._actions$
          .pipe(ofType(...this.closeOnActions), take(1))
          .subscribe(() => this.dialog.close());
      }
    });

    this._store
      .select(selectQueryParams)
      .pipe(takeUntilDestroyed(), debounceTime(25), distinctUntilChangedDeep())
      .subscribe((params) => {
        if (!Object.keys(params).includes(this.route)) {
          this.dialog.close();
        }
      });
  }
}
