import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appValidatorMessageContainer]',
  standalone: true,
  exportAs: 'validatorMessageContainer',
})
export class ValidatorMessageContainerDirective {
  public container = inject(ViewContainerRef);
}
