/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ENVIRONMENT, FeatureFlag } from '@app/client/core/environment';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[featureFlag]', standalone: true })
export class FeatureFlagDirective {
  protected templateRef = inject(TemplateRef);

  protected viewContainer = inject(ViewContainerRef);

  protected environment = inject(ENVIRONMENT);

  protected hasView = signal(false);

  @Input() public set featureFlag(feature: FeatureFlag) {
    if (this.environment[feature] && !this.hasView()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView.set(true);
    } else {
      this.viewContainer.clear();
      this.hasView.set(false);
    }
  }

  @Input() public set featureFlagElse(elseTemplateRef: TemplateRef<any>) {
    if (!this.hasView()) {
      this.viewContainer.createEmbeddedView(elseTemplateRef);
    }
  }
}
