import { CommonModule, KeyValue } from '@angular/common';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  OnDestroy,
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
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { take } from 'rxjs';
import { CONTROL_DATA } from './control-data.token';
import { DynamicControlFocusHandler } from './dynamic-control-focus-handler.service';
import { DynamicControl } from './dynamic-forms.model';
import { ErrorMessagePipe } from './error-message.pipe';
import { validatorMapper } from './validator.mapper';

export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>,
): number => a.value.order - b.value.order;

export const comparatorFn2 = (a: DynamicControl, b: DynamicControl): number =>
  a.order - b.order;

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
export abstract class BaseDynamicControl
  implements OnInit, AfterViewInit, OnDestroy
{
  @HostBinding('class') protected hostClass = 'form-field block';

  protected control = inject(CONTROL_DATA);
  protected elementRef = inject(ElementRef);
  protected destroyRef = inject(DestroyRef);
  protected focusHandler = inject(DynamicControlFocusHandler, {
    optional: true,
  });
  protected parentGroupDir = inject(ControlContainer);

  protected formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config),
  );

  protected state = signal({
    focused: false,
  });

  protected focused = computed(() => this.state().focused);

  protected abstract onFocus: () => void;

  public ngOnInit(): void {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
    this.registerFocusHandler(this.control.controlKey);
  }

  public ngAfterViewInit(): void {
    this.focusHandler
      ?.focusChanged$(this.control.controlKey)
      ?.pipe(take(1))
      .subscribe((isFocused) => {
        if (isFocused) {
          setTimeout(() => {
            this?.onFocus();
          }, 25);
        }
      });
  }

  public ngOnDestroy(): void {
    (this.parentGroupDir.control as FormGroup).removeControl(
      this.control.controlKey,
    );
  }

  private resolveValidators({
    validators = {},
  }: DynamicControl): ValidatorFn[] {
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

  private registerFocusHandler(controlKey: string): void {
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
