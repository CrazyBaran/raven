import { CommonModule, KeyValue } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  OnInit,
  StaticProvider,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CONTROL_DATA } from './control-data.token';
import { DynamicControlFocusHandler } from './dynamic-control-focus-handler.service';
import { DynamicControl, validatorMapper } from './dynamic-forms.model';
import { ErrorMessagePipe } from './error-message.pipe';

export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>,
): number => a.value.order - b.value.order;

export const sharedDynamicControlDeps = [
  CommonModule,
  FormFieldModule,
  LabelModule,
  ReactiveFormsModule,
  ErrorMessagePipe,
];

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true }),
};

@Directive()
export abstract class BaseDynamicControl implements OnInit {
  @HostBinding('class') hostClass = 'form-field';

  control = inject(CONTROL_DATA);
  elementRef = inject(ElementRef);
  destroyRef = inject(DestroyRef);
  focusHandler = inject(DynamicControlFocusHandler, {
    optional: true,
  });
  parentGroupDir = inject(ControlContainer);

  formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config),
  );

  state = signal({
    focused: false,
  });

  focused = computed(() => this.state().focused);

  ngOnInit() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
    this.registerFocusHandler(this.control.controlKey);
  }

  abstract onFocus: () => void;

  private resolveValidators({ validators = {} }: DynamicControl) {
    const entries = Object.entries(validators) as [
      keyof typeof validators,
      unknown,
    ][];

    return entries.map(
      ([validatorKey, validatorValue]) =>
        validatorMapper[validatorKey]?.(validatorValue) ??
        Validators.nullValidator,
    );
  }

  private registerFocusHandler(controlKey: string) {
    if (!this.focusHandler) {
      return;
    }

    this.focusHandler
      .focusChanged$(controlKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focused) => {
        if (focused) {
          this?.onFocus();
        }
        this.state.update((state) => ({
          ...state,
          focused,
        }));
      });
  }
}
