import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewChild,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// TODO: Fix this import
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BadgeComponent } from '@app/client/shared/ui';
// TODO: Fix this import
// eslint-disable-next-line @nx/enforce-module-boundaries
import { HearColorPipe } from '@app/client/shared/ui-pipes';
import {
  NumericTextBoxComponent,
  NumericTextBoxModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { isObservable } from 'rxjs';
import {
  BaseDynamicControlComponent,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control-component.directive';
import { DynamicNumericControl } from '../../dynamic-forms.model';

@Component({
  selector: 'app-dynamic-numeric-input',
  standalone: true,
  imports: [
    sharedDynamicControlDeps,
    TextBoxModule,
    NumericTextBoxModule,
    BadgeComponent,
    HearColorPipe,
  ],
  templateUrl: './dynamic-numeric-input.component.html',
  styleUrls: ['./dynamic-numeric-input.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNumericInputComponent extends BaseDynamicControlComponent<DynamicNumericControl> {
  @ViewChild(NumericTextBoxComponent)
  protected textBox: NumericTextBoxComponent;

  protected badgeText = computed((): string => {
    return this.control.config.heatmapFn?.(this.value()!) ?? '';
  });

  public constructor() {
    super();

    if (
      this.control.config.calculatedValue$ &&
      isObservable(this.control.config.calculatedValue$)
    ) {
      this.control.config.calculatedValue$
        .pipe(takeUntilDestroyed())
        .subscribe((v) => {
          this.formControl.setValue(v!);
          this.formControl.markAsTouched();
        });
    }
  }

  public get formatOptions(): string {
    return `#,##.######## '${this.control.config.unit}'`;
  }

  protected get numericValue(): number {
    const value = this.control.config.value;
    return value ? Number(value) : 0;
  }

  protected override onFocus = (): void => {
    this.textBox?.focus();
    this.elementRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  protected setFocus(): void {
    this.focusHandler?.focusTo(this.control.controlKey);
  }
}
