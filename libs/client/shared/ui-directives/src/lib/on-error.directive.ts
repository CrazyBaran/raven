/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { FormFieldComponent } from '@progress/kendo-angular-inputs';
import { startWith } from 'rxjs';

@Directive()
export class BaseKendoFormFieldDirective {
  private formField = inject(FormFieldComponent, { optional: true });

  protected _getControl(): AbstractControl | null {
    // accessing private property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.formField as any)?.control?.control;
  }
}

@Directive({
  selector: '[uiOnError]',
  standalone: true,
})
export class OnErrorDirective
  extends BaseKendoFormFieldDirective
  implements AfterViewInit
{
  public errorName = input('', {
    alias: 'uiOnError',
  });

  private templateRef = inject(TemplateRef);

  private viewContainer = inject(ViewContainerRef);

  private destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    const control = this._getControl();
    if (!control) {
      return;
    }

    control.statusChanges
      .pipe(startWith(control.status), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (control.invalid && control.errors?.[this.errorName()]) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef, {
            $implicit: control.errors[this.errorName()],
          });
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
