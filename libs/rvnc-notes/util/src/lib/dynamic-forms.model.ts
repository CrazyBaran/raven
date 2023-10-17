import { ValidatorFn, Validators } from '@angular/forms';

export interface DynamicOptions {
  label: string;
  value: string;
}
type CustomValidators = { banWords: ValidatorFn };
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
