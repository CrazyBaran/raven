import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RichTextComponent } from '@app/client/shared/dynamic-form-util';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { ControlValueAccessor } from '@app/client/shared/util';
import { Plugin, Schema } from '@progress/kendo-angular-editor';
import {
  StatusIndicatorComponent,
  StatusIndicatorState,
} from '../status-indicator/status-indicator.component';

export type ProseMirrorSettings = { plugins: Plugin[]; schema: Schema };

@Component({
  selector: 'app-note-field',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    RichTextComponent,
    StatusIndicatorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './note-field.component.html',
  styleUrl: './note-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NoteFieldComponent),
      multi: true,
    },
  ],
})
export class NoteFieldComponent extends ControlValueAccessor<string> {
  public valueChange = output<string>();

  public field = input.required<{
    title: string;
  }>();

  public state = input<StatusIndicatorState>();

  public readonly = input<boolean>();

  public proseMirrorSettings = input<ProseMirrorSettings>();

  protected richTextControl = new FormControl('');

  public override writeValue(value: string): void {
    this.richTextControl.setValue(value, { emitEvent: false });
  }

  protected onValueChange(value: string): void {
    this.onChange?.(value);
    this.valueChange.emit(value);
  }

  protected onBlur(): void {
    this.onTouched?.();
  }
}
