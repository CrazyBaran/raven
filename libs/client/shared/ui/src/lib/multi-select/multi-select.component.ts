/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering,@angular-eslint/no-output-on-prefix,@angular-eslint/no-output-rename */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ControlValueAccessor } from '@app/client/shared/util';
import { takeAfterViewInit } from '@app/client/shared/util-rxjs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  MultiSelectComponent as KendoMultiSelectComponent,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { IconModule } from '@progress/kendo-angular-icons';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';

export type MultiSelectData = any;
export type MultiSelectValue = any;

@Component({
  selector: 'ui-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    TextBoxModule,
    IconModule,
    ButtonModule,
    ReactiveFormsModule,
    TextAreaModule,
  ],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultiSelectComponent,
      multi: true,
    },
  ],
})
export class MultiSelectComponent extends ControlValueAccessor<
  MultiSelectValue[]
> {
  @ViewChild(KendoMultiSelectComponent, { static: true })
  protected multiSelect: KendoMultiSelectComponent;

  protected wrappedSelectForm = new FormControl();
  protected searchControl = new FormControl();

  public data = input<MultiSelectData[]>();
  public fillMode = input<KendoMultiSelectComponent['fillMode']>();
  public textField = input<string>();
  public valueField = input<string>();
  public valuePrimitive = input<boolean>();
  public placeholder = input<string>();
  public virtual = input<boolean>();
  public loading = input<boolean>();
  public filterable = input<boolean>();
  public checkboxes = input<boolean>();

  @Output('onBlur') public blur$ = takeAfterViewInit(
    () => this.multiSelect.onBlur,
  );
  @Output('onFocus') public focus$ = takeAfterViewInit(
    () => this.multiSelect.onFocus,
  );
  @Output('onChange') public changed = new EventEmitter<MultiSelectValue[]>();

  public constructor() {
    super();
    this.blur$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onTouched!();
    });
  }

  public override writeValue(value: MultiSelectValue[]): void {
    this.wrappedSelectForm.setValue(value, { emitEvent: false });
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.wrappedSelectForm.disable({ emitEvent: false });
    } else {
      this.wrappedSelectForm.enable({ emitEvent: false });
    }
  }

  public onValueChange($event: MultiSelectValue[]): void {
    this.onChange!($event);
    this.changed.emit($event);
  }
}
