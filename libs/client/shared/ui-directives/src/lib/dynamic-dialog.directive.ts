/* eslint-disable @typescript-eslint/no-explicit-any,@angular-eslint/directive-selector */
import { Directive, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicDialogParam } from '@app/client/shared/util';

@Directive({
  selector: '[dynamicDialog]',
  standalone: true,
  hostDirectives: [RouterLink],
})
export class dynamicDialogDirective {
  public routerLink = inject(RouterLink);

  public dynamicDialog = input.required<
    [DynamicDialogParam, any] | [DynamicDialogParam]
  >();

  public constructor() {
    this.routerLink.queryParamsHandling = 'merge';
    this.routerLink.routerLink = ['./'];
    this.routerLink.skipLocationChange = true;

    effect(() => {
      this.routerLink.queryParams = {
        [this.dynamicDialog()[0]]: this.dynamicDialog()[1],
      };
    });
  }
}
