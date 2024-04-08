import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';

@Directive()
export abstract class DynamicDialogContentBase extends DialogContentBase {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  public abstract route: string;

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
  }
}
