import { Injectable, Type } from '@angular/core';

import { Observable, from, of, tap } from 'rxjs';
import { DynamicControl } from './dynamic-forms.model';

type DynamicControlsMap = {
  [T in DynamicControl['type']]: () => Promise<Type<unknown>>;
};

@Injectable({
  providedIn: 'root',
})
export class DynamicControlResolver {
  private lazyControlComponents: DynamicControlsMap = {
    text: () =>
      import('./inputs/dynamic-input/dynamic-input.component').then(
        (c) => c.DynamicInputComponent,
      ),
    richText: () =>
      import('./inputs/dynamic-rich-text/dynamic-rich-text.component').then(
        (c) => c.DynamicRichTextComponent,
      ),
    numeric: () =>
      import(
        './inputs/dynamic-numeric-input/dynamic-numeric-input.component'
      ).then((c) => c.DynamicNumericInputComponent),
    group: () =>
      import('./inputs/dynamic-group/dynamic-group.component').then(
        (c) => c.DynamicGroupComponent,
      ),
  };

  private loadedControlComponents = new Map<string, Type<unknown>>();

  public resolve(
    controlType: keyof DynamicControlsMap,
  ): Observable<Type<unknown>> {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) {
      return of(loadedComponent);
    }
    return from(this.lazyControlComponents[controlType]()).pipe(
      tap((comp) => this.loadedControlComponents.set(controlType, comp)),
    );
  }
}
