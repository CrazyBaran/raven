/* eslint-disable @typescript-eslint/member-ordering,@typescript-eslint/no-explicit-any */
import { NgIf } from '@angular/common';
import {
  DestroyRef,
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[recreateView]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class RecreateViewDirective {
  public constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  protected destroyRef = inject(DestroyRef);

  @Input() public set recreateView(source: unknown | Observable<unknown>) {
    if (source instanceof Observable) {
      source.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this._recreateView();
      });
    } else {
      this._recreateView();
    }
  }

  private _recreateView(): void {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
