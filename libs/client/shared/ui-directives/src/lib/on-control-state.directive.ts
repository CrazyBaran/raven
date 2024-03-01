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
import { startWith } from 'rxjs';
import { BaseKendoFormFieldDirective } from './on-error.directive';

@Directive({
  selector: '[uiOnControlState]',
  standalone: true,
})
export class OnControlStateDirective
  extends BaseKendoFormFieldDirective
  implements AfterViewInit
{
  public status = input.required<AbstractControl['status']>({
    alias: 'uiOnControlState',
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
        if (control.status === this.status()) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
