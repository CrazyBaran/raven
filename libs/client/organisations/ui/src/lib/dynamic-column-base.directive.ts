import { Directive } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ComponentData,
  DynamicComponent,
} from '@app/client/shared/dynamic-renderer/data-access';

@Directive()
export class DynamicColumnBase<T> implements DynamicComponent {
  public field: T;

  public componentDataResolver(data: ComponentData): { field: T } {
    return {
      field: data['field'],
    };
  }
}
