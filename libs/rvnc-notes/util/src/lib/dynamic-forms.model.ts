import { ValidatorFn, Validators } from '@angular/forms';

export interface DynamicOptions {
  label: string;
  value: string;
}
type CustomValidators = {
  //
};

type ValidatorKeys = keyof Omit<
  typeof Validators & CustomValidators,
  'prototype' | 'compose' | 'composeAsync'
>;

export interface DynamicControl<T = string> {
  controlType: 'input' | 'richText';
  type?: string;
  label: string;
  placeholder?: string;
  order: number;
  value: T | null;
  options?: DynamicOptions[];
  controls?: DynamicFormConfig['controls'];
  validators?: {
    [key in ValidatorKeys]?: unknown;
  };
}

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const validatorMapper: Record<
  ValidatorKeys,
  (value: unknown) => ValidatorFn
> = {
  required: () => Validators.required,
  email: () => Validators.email,
  requiredTrue: () => Validators.requiredTrue,
  minLength: (value: unknown) =>
    typeof value === 'number'
      ? Validators.minLength(value)
      : Validators.nullValidator,
  maxLength: (value: unknown) =>
    typeof value === 'number'
      ? Validators.maxLength(value)
      : Validators.nullValidator,
  min: (value: unknown) =>
    typeof value === 'number'
      ? Validators.min(value)
      : Validators.nullValidator,
  max: (value: unknown) =>
    typeof value === 'number'
      ? Validators.max(value)
      : Validators.nullValidator,
  pattern: (value: unknown) =>
    typeof value === 'string'
      ? Validators.pattern(value)
      : Validators.nullValidator,
  nullValidator: () => Validators.nullValidator,
};
