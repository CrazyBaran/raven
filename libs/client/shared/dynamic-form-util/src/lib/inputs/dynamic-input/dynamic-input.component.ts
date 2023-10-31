import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import {
  TextBoxComponent,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [sharedDynamicControlDeps, TextBoxModule],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputComponent extends BaseDynamicControl {
  @ViewChild(TextBoxComponent) protected textBox: TextBoxComponent;

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