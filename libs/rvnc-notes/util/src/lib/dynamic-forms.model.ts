import { ValidatorFn, Validators } from '@angular/forms';

export interface DynamicOptions {
  label: string;
  value: string;
}
type CustomValidators = {};

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

export const validatorMapper: Record<
  ValidatorKeys,
  (...value: any) => ValidatorFn
> = {
  required: () => Validators.required,
  email: () => Validators.email,
  requiredTrue: () => Validators.requiredTrue,
  minLength: (value: number) => Validators.minLength(value),
  maxLength: (value: number) => Validators.maxLength(value),
  min: (value: number) => Validators.min(value),
  max: (value: number) => Validators.max(value),
  pattern: (value: string | RegExp) => Validators.pattern(value),
  nullValidator: () => Validators.nullValidator,
};
