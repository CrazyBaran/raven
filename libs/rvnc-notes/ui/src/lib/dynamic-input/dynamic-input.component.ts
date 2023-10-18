import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  BaseDynamicControl,
  ErrorMessagePipe,
  dynamicControlProvider,
} from '@app/rvnc-notes/util';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextBoxModule,
    LabelModule,
    FormFieldModule,
    ErrorMessagePipe,
  ],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputComponent extends BaseDynamicControl {}
