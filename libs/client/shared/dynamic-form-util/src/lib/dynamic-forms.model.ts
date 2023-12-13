import { Validators } from '@angular/forms';
import { HeatMapValue } from '@app/rvns-templates';

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

export interface BaseDynamicControl<T = string> {
  name: string;
  order: number;
  id: string;
  placeholder?: string;
  value?: T | null;
  options?: DynamicOptions[];
  validators?: {
    [key in ValidatorKeys]?: unknown;
  };
}

export interface DynamicTextControl extends BaseDynamicControl {
  type: 'text';
}

export interface DynamicRichTextControl extends BaseDynamicControl {
  type: 'richText';
  grow?: boolean;
}

export interface DynamicNumericControl extends BaseDynamicControl {
  type: 'numeric';
  min?: number;
  max?: number;
  unit?: string;
  heatmapFn?: (value: number) => HeatMapValue | null;
}

export interface DynamicGroupControl extends BaseDynamicControl {
  type: 'group';
  controls: DynamicFormConfig['controls'];
  labelClass?: string;
  fieldsetClass?: string;
}

export type DynamicControl =
  | DynamicTextControl
  | DynamicRichTextControl
  | DynamicNumericControl
  | DynamicGroupControl;

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
}
