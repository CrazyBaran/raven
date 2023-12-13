import { InjectionToken } from '@angular/core';
import { BaseDynamicControl } from './dynamic-forms.model';

export interface ControlData<
  T extends BaseDynamicControl = BaseDynamicControl,
> {
  controlKey: string;
  config: T;
}

export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
