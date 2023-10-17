import { CommonModule, KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ErrorMessagePipe } from '@app/rvnc-notes/util';
import { FormFieldModule } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule, ErrorMessagePipe, FormFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kendo-formerror
      *ngFor="let error of errors ?? [] | keyvalue; trackBy: trackByFn"
    >
      {{ error.key | errorMessage: error.value }}
    </kendo-formerror>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class InputErrorComponent {
  @Input()
  errors: ValidationErrors | undefined | null = null;

  trackByFn(index: number, item: KeyValue<string, any>) {
    return item.key;
  }
}
