import { Validators } from '@angular/forms';

export interface DynamicOptions {
  label: string;
  value: string;
}
type CustomValidators = {
  //
};

export type ValidatorKeys = keyof Omit<
  typeof Validators & CustomValidators,
  'prototype' | 'compose' | 'composeAsync'
>;

export interface FieldDefinitionData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly order: number;
  readonly fieldGroupId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
}

export interface DynamicControl<T = string> {
  type: 'text' | 'richText';
  name: string;
  order: number;
  id: string;

  grow?: boolean;
  placeholder?: string;
  value?: T | null;
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
