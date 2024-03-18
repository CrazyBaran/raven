/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgIf } from '@angular/common';
import { Directive, inject, Input } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ENVIRONMENT, FeatureFlag } from '@app/client/core/environment';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[featureFlag]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgIf,
      inputs: ['ngIfElse: featureFlagElse'],
    },
  ],
})
export class FeatureFlagDirective {
  protected environment = inject(ENVIRONMENT);
  protected ngIfDirective = inject(NgIf);

  @Input() public set featureFlag(feature: FeatureFlag) {
    this.ngIfDirective.ngIf = this.environment[feature];
  }
}
