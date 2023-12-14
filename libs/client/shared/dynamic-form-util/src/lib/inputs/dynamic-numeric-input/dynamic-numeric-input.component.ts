import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewChild,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { BadgeComponent } from '@app/client/shared/ui';
import { HearColorPipe } from '@app/client/shared/ui-pipes';
import {
  NumericTextBoxComponent,
  NumericTextBoxModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import * as _ from 'lodash';
import { startWith } from 'rxjs';
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

  protected numberFormControl = new FormControl(
    this.control.config.value ? Number(this.control.config.value) : null,
  );

  protected value = toSignal(
    this.numberFormControl.valueChanges.pipe(
      startWith(this.numberFormControl.value),
    ),
  );

  protected badgeText = computed((): string => {
    return this.control.config.heatmapFn?.(this.value()!) ?? '';
  });

  public constructor() {
    super();
    this.numberFormControl.valueChanges.subscribe((value) => {
      if (_.isNumber(value)) {
        this.formControl.setValue(String(value));
      } else {
        this.formControl.setValue('');
      }
    });
  }

  public get formatOptions() {
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
